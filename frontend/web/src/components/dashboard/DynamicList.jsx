// BottomDynamicList.jsx — FULL DROP-IN (theme-only numbers, no background)
// Sticks to the parent's bottom by behaving as a flex child that fills remaining height.
// ✅ Requirements for parent container:
// - display: "flex"
// - flexDirection: "column"
// - minHeight: 0  (IMPORTANT so the list can actually scroll)

import React, { useMemo } from "react";
import { theme } from "../../App.jsx";
import Scrollbar from "react-scrollbars-custom";
import {AwesomeScroll} from "./AwesomeScroll.jsx";

export default function DynamicList({
                                              items,                  // optional: array
                                              renderItem,             // optional: (item, index) => ReactNode
                                              children,               // optional: if you want to pass JSX directly
                                              style,
                                              contentStyle,
                                              scrollVisible = false,
                                              ariaLabel = "List",
                                          }) {

    const styles = useMemo(() => {
        return {
            wrap: {
                // occupy remaining height in a column layout
                // flex: theme.bottomDynamicList.flex,
                // minHeight: theme.bottomDynamicList.minHeight,
                width: theme.bottomDynamicList.width,

                // stick to bottom (items naturally sit at the end)
                display: "flex",
                flexDirection: "column",
                justifyContent: theme.bottomDynamicList.justify,

                // scroll
                // overflowY: theme.bottomDynamicList.overflowY,
                // overflowX: theme.bottomDynamicList.overflowX,

                // no background
                background: theme.panel.none,

                // spacing from content above
                marginTop: theme.bottomDynamicList.topMargin,

                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                overscrollBehavior: "contain", // ✅ key
                WebkitOverflowScrolling: "touch",
            },

            content: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: theme.bottomDynamicList.gap,

                // keeps content visually “resting” at bottom while still scrollable
                paddingTop: theme.bottomDynamicList.padTop,
                paddingBottom: theme.bottomDynamicList.padBottom,
                paddingLeft: theme.bottomDynamicList.padX,
                paddingRight: theme.bottomDynamicList.padX,

                ...contentStyle
            },
        };
    }, [contentStyle]);

    const rendered = useMemo(() => {
        if (Array.isArray(items) && typeof renderItem === "function") {
            return items.map((item, idx) => (
                <React.Fragment key={item?.id ?? idx}>{renderItem(item, idx)}</React.Fragment>
            ));
        }
        return children;
    }, [items, renderItem, children]);

    return (
        <div className={'dynamic-list'} style={{
            ...style,
            flex: "1 1 auto",
            height: theme.pageSizeHeightRelative,
        }}>
            <style>
                {
                    `
                       .dynamic-list {
                            -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
                            mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
                       }
            `
                }

            </style>
            <AwesomeScroll scrollVisible={scrollVisible}>
                <div style={{...styles.content, ...contentStyle}}>{rendered}</div>
            </AwesomeScroll>
        </div>

    );
}