import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {
    getTrackingPermissionsAsync,
    requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import {WebView} from "react-native-webview";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import bundledWebHtml from "./src/generated/webBundle";
import {addNativeContext, getEmbeddedPath, GOODLANG_ORIGIN} from "./src/embeddedApp.mjs";

const APP_BACKGROUND_COLOR = "#f8f7fc";

function GoodLangApp() {
    const safeAreaInsets = useSafeAreaInsets();
    const webViewRef = useRef(null);
    const [trackingStatus, setTrackingStatus] = useState(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [embeddedPage, setEmbeddedPage] = useState({key: 0, path: "/"});
    const [loadError, setLoadError] = useState(null);
    const [practiceScreen, setPracticeScreen] = useState(false);
    const keyboardOpenRef = useRef(false);
    const viewportRef = useRef({height: 0});
    const currentPathRef = useRef("/");

    const reloadEmbeddedApp = useCallback((path = currentPathRef.current) => {
        const nextPath = getEmbeddedPath(path, currentPathRef.current);
        currentPathRef.current = nextPath;
        Keyboard.dismiss();
        keyboardOpenRef.current = false;
        setPracticeScreen(false);
        setCanGoBack(false);
        setLoadError(null);
        setEmbeddedPage((page) => ({key: page.key + 1, path: nextPath}));
    }, []);

    const syncEmbeddedViewport = useCallback((layout = viewportRef.current) => {
        viewportRef.current = layout;
        if (!layout.height) return;
        webViewRef.current?.injectJavaScript(`
            document.documentElement.style.setProperty("--native-viewport-height", "${layout.height}px");
            true;
        `);
    }, []);

    const handleWebMessage = useCallback((event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === "goodlang:reload") {
                reloadEmbeddedApp(typeof message.path === "string" ? message.path : undefined);
                return;
            }
            if (message.type !== "goodlang:practice-screen" || typeof message.active !== "boolean") return;
            setPracticeScreen(message.active);
            if (!message.active) Keyboard.dismiss();
        } catch {
            // Ignore unrelated messages from embedded content.
        }
    }, [reloadEmbeddedApp]);

    const setEmbeddedKeyboardState = useCallback((keyboardOpen) => {
        keyboardOpenRef.current = keyboardOpen;
        webViewRef.current?.injectJavaScript(`
            document.documentElement.classList.toggle(
                "goodlang-mobile-keyboard-open",
                ${keyboardOpen ? "true" : "false"}
            );
            true;
        `);
    }, []);

    useEffect(() => {
        let active = true;

        async function prepareTracking() {
            try {
                let permission = await getTrackingPermissionsAsync();
                if (permission.status === "undetermined") {
                    permission = await requestTrackingPermissionsAsync();
                }
                if (active) setTrackingStatus(permission.status);
            } catch (error) {
                // Fail closed for Meta tracking while still allowing the app to load.
                if (active) setTrackingStatus("denied");
            }
        }

        prepareTracking();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (Platform.OS !== "android") return undefined;

        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            if (!canGoBack) return false;
            webViewRef.current?.goBack();
            return true;
        });
        return () => subscription.remove();
    }, [canGoBack]);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
        const showSubscription = Keyboard.addListener(showEvent, () => {
            setEmbeddedKeyboardState(true);
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setEmbeddedKeyboardState(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [setEmbeddedKeyboardState]);

    const html = useMemo(
        () => trackingStatus
            ? addNativeContext(bundledWebHtml, {
                isNativeApp: true,
                platform: Platform.OS,
                trackingStatus,
                cookieConsentManagedNatively: true,
                safeAreaInsets,
            }, embeddedPage.path)
            : null,
        [
            safeAreaInsets.bottom,
            safeAreaInsets.left,
            safeAreaInsets.right,
            safeAreaInsets.top,
            trackingStatus,
            embeddedPage.path,
        ],
    );

    const handleNavigationRequest = useCallback((request) => {
        const url = request.url || "";
        if (url.startsWith("mailto:") || url.startsWith("tel:")) {
            Linking.openURL(url).catch(() => {});
            return false;
        }
        if (request.navigationType === "reload" && request.isTopFrame !== false
            && getEmbeddedPath(url, null) !== null) {
            reloadEmbeddedApp(url);
            return false;
        }
        return true;
    }, [reloadEmbeddedApp]);

    return (
        <KeyboardAvoidingView style={styles.root} behavior="padding" enabled={practiceScreen && Platform.OS === "ios"}>
            <View style={[styles.root, practiceScreen && {paddingTop: safeAreaInsets.top}]}>
                <StatusBar style="dark" backgroundColor={APP_BACKGROUND_COLOR} />
                <View style={styles.root} onLayout={(event) => syncEmbeddedViewport(event.nativeEvent.layout)}>
                    {!html ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#171a31" />
                        </View>
                    ) : loadError ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorTitle}>GoodLang could not open</Text>
                            <Text style={styles.errorText}>{loadError}</Text>
                            <TouchableOpacity accessibilityRole="button" style={styles.retryButton} onPress={() => reloadEmbeddedApp()}>
                                <Text style={styles.retryText}>Try again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <WebView
                            key={embeddedPage.key}
                            ref={webViewRef}
                            style={styles.webView}
                            source={{html, baseUrl: `${GOODLANG_ORIGIN}/`}}
                            originWhitelist={["*"]}
                            javaScriptEnabled
                            domStorageEnabled
                            sharedCookiesEnabled
                            thirdPartyCookiesEnabled
                            cacheEnabled
                            cacheMode="LOAD_DEFAULT"
                            allowsInlineMediaPlayback
                            setSupportMultipleWindows={false}
                            automaticallyAdjustContentInsets={false}
                            contentInsetAdjustmentBehavior="never"
                            bounces={false}
                            scrollEnabled={!practiceScreen}
                            keyboardDisplayRequiresUserAction
                            hideKeyboardAccessoryView
                            applicationNameForUserAgent="GoodLang/1.0.0"
                            onLoadEnd={() => {
                                setEmbeddedKeyboardState(keyboardOpenRef.current);
                                syncEmbeddedViewport();
                            }}
                            onMessage={handleWebMessage}
                            onShouldStartLoadWithRequest={handleNavigationRequest}
                            onNavigationStateChange={(state) => {
                                currentPathRef.current = getEmbeddedPath(state.url, currentPathRef.current);
                                setCanGoBack(state.canGoBack);
                            }}
                            onError={(event) => setLoadError(event.nativeEvent.description || "Please check your connection and try again.")}
                            onHttpError={(event) => setLoadError(`Server error ${event.nativeEvent.statusCode}. Please try again.`)}
                            onContentProcessDidTerminate={() => reloadEmbeddedApp()}
                        />
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export default function App() {
    return (
        <SafeAreaProvider style={styles.root}>
            <GoodLangApp />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: APP_BACKGROUND_COLOR,
    },
    webView: {
        flex: 1,
        backgroundColor: APP_BACKGROUND_COLOR,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backgroundColor: APP_BACKGROUND_COLOR,
    },
    errorTitle: {
        color: "#171a31",
        fontSize: 21,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    errorText: {
        color: "#66697a",
        fontSize: 15,
        lineHeight: 21,
        marginBottom: 22,
        textAlign: "center",
    },
    retryButton: {
        minWidth: 140,
        borderRadius: 14,
        paddingHorizontal: 22,
        paddingVertical: 13,
        backgroundColor: "#171a31",
    },
    retryText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
});
