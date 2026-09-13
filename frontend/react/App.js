import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    BackHandler,
    Keyboard,
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

const GOODLANG_ORIGIN = "https://goodlang.app";
const APP_BACKGROUND_COLOR = "#f8f9fc";

function addNativeContext(html, trackingStatus, safeAreaInsets) {
    const context = JSON.stringify({
        isNativeApp: true,
        platform: Platform.OS,
        trackingStatus,
        cookieConsentManagedNatively: true,
        safeAreaInsets,
    }).replaceAll("<", "\\u003c");
    const bootstrap = `<script>
        window.__GOODLANG_NATIVE__=${context};
        (function () {
            var root = document.documentElement;
            root.classList.add("goodlang-native");
            root.style.setProperty("--native-safe-top", "${safeAreaInsets.top}px");
            root.style.setProperty("--native-safe-bottom", "${safeAreaInsets.bottom}px");
        })();
    </script>`;
    return html.replace("<head>", `<head>${bootstrap}`);
}

function GoodLangApp() {
    const safeAreaInsets = useSafeAreaInsets();
    const webViewRef = useRef(null);
    const [trackingStatus, setTrackingStatus] = useState(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [webViewKey, setWebViewKey] = useState(0);
    const [loadError, setLoadError] = useState(null);
    const keyboardOpenRef = useRef(false);

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
            ? addNativeContext(bundledWebHtml, trackingStatus, safeAreaInsets)
            : null,
        [
            safeAreaInsets.bottom,
            safeAreaInsets.left,
            safeAreaInsets.right,
            safeAreaInsets.top,
            trackingStatus,
        ],
    );

    const handleNavigationRequest = useCallback((request) => {
        const url = request.url || "";
        if (url.startsWith("mailto:") || url.startsWith("tel:")) {
            Linking.openURL(url).catch(() => {});
            return false;
        }
        return true;
    }, []);

    const retry = useCallback(() => {
        setLoadError(null);
        setWebViewKey((value) => value + 1);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar style="dark" backgroundColor={APP_BACKGROUND_COLOR} />
            {!html ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#171a31" />
                </View>
            ) : loadError ? (
                <View style={styles.centered}>
                    <Text style={styles.errorTitle}>GoodLang could not open</Text>
                    <Text style={styles.errorText}>{loadError}</Text>
                    <TouchableOpacity accessibilityRole="button" style={styles.retryButton} onPress={retry}>
                        <Text style={styles.retryText}>Try again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <WebView
                    key={webViewKey}
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
                    keyboardDisplayRequiresUserAction
                    applicationNameForUserAgent="GoodLang/1.0.0"
                    onLoadEnd={() => setEmbeddedKeyboardState(keyboardOpenRef.current)}
                    onShouldStartLoadWithRequest={handleNavigationRequest}
                    onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
                    onError={(event) => setLoadError(event.nativeEvent.description || "Please check your connection and try again.")}
                    onHttpError={(event) => setLoadError(`Server error ${event.nativeEvent.statusCode}. Please try again.`)}
                    onContentProcessDidTerminate={() => webViewRef.current?.reload()}
                />
            )}
        </View>
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
