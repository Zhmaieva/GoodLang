import React, {useMemo} from "react";
import {theme} from "../../App.jsx";

export function Header({title, subtitle}) {
    const t = theme.numberSlider;

    return (
        <div style={t.header}>
            <div style={t.valueLine}>
                <span style={t.valueNumber}>{`${title}`}</span>
            </div>
            {!!subtitle && <div style={t.subtitle}>{subtitle}</div>}
        </div>
    )
}