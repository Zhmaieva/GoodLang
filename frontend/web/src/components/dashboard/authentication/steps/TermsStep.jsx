import React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../../App.jsx";

import DynamicList from "../../DynamicList.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

/**
 * TermsStep
 * Props:
 * - paragraphs: array of strings (EXACT same paragraphs as in TermsOfUseModal)
 * - verifyApi: async (payload) => boolean | void   // should match your SignInPage verifyapi call shape
 * - onAccepted: () => void                         // goNext / move flow forward
 */
export default function TermsStep({
                                      paragraphs = [],
                                      verifyApi,
                                      onAccepted,
                                  }) {
    const nav = useNavigate();

    const subtitleStyle = {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
    };

    const stackStyle = {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
        minHeight: 0,
        height: "100%",
    };

    const actionsRowStyle = {
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: theme.layout?.rowAlign || "center",
        justifyContent: "space-between",
        gap: theme.spacing.gap,
        flex: "0 0 auto",
    };

    const onDecline = () => {
        nav("/welcome");
    };

    const onAccept = async () => {
        // ✅ same intent as SignInPage: verifyApi with termsAccepted true
        const ok = await verifyApi?.({ termsAccepted: true });
        if (ok === false) return;
        onAccepted?.();
    };

    const items = Array.isArray(paragraphs) ? paragraphs : [];

    return (
        <div style={stackStyle}>
            <div style={subtitleStyle}>In order to use the service, you must read and accept terms of use and privacy policy</div>

            <DynamicList style={{
                height: "500px",
            }} ariaLabel="Terms paragraphs">
                {items.map(({title, content}) => (
                    <RectangleGroup title={title} key={title}>
                        <div
                            style={{
                                fontFamily: theme.fontFamily,
                                fontSize: theme.type.subtitle,
                                fontWeight: theme.weights.normal,
                                lineHeight: theme.type.subtitleLineHeight,
                                color: theme.textMutedDark,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {content.join(' ')}
                        </div>
                    </RectangleGroup>
                ))}
            </DynamicList>

            <div style={actionsRowStyle}>
                <AwesomeActionButton variant="ghost" size="regular" onClick={onDecline}>
                    I do not accept
                </AwesomeActionButton>

                <AwesomeActionButton variant="ghost" size="regular" onClick={onAccept}>
                    I accept
                </AwesomeActionButton>
            </div>
        </div>
    );
}
