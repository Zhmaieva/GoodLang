import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { theme } from "../../App.jsx"; // adjust path

export default function QrPng({
                                  value,
                                  size = 180,
                                  margin = 1,
                                  alt = "QR code",
                                  style,
                                  onReady,
                              }) {
    const [dataUrl, setDataUrl] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (!value) {
                setDataUrl("");
                onReady?.("");
                return;
            }

            const url = await QRCode.toDataURL(value, {
                width: size,
                margin,
                errorCorrectionLevel: "M",
                color: {
                    dark: theme.textDark, // QR squares
                    light: theme.bg,      // 🔥 background instead of white
                },
            });

            if (!cancelled) {
                setDataUrl(url);
                onReady?.(url);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [value, size, margin, onReady]);

    if (!dataUrl) return null;

    return (
        <img
            src={dataUrl}
            width={size}
            height={size}
            alt={alt}
            style={{ display: "block", ...style }}
        />
    );
}
