import React, {useMemo} from "react";
import {theme} from "../../App.jsx";

export default function FooterNextButtons({disabled = false, children}) {

    const t = theme.page;

    const styles = useMemo(
        () => ({
            footer: {
                flex: "0 0 auto",
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                paddingTop: t.footerPadTop,
                opacity: !disabled ? 1 : 0,
                visibility: disabled ? "hidden" : "visible",
                transition: "opacity 0.3s"
            },

            footerInner: {
                paddingBottom: t.footerPadBottom,
                paddingRight: t.footerPadRight,
            },
        }),
        [t, disabled]
    );

    return (
        <div style={{...styles.footer, ...styles.footerInner}}>
            {children}
        </div>
    )
}