import Scrollbar from "react-scrollbars-custom";
import {useState} from "react";

export function AwesomeScroll({ children, style }) {
    const [hovered, setHovered] = useState(false);

    return (
        <>
            <style>{
                `
                .awesome-scroll:hover .ScrollbarsCustom-TrackY {
                  opacity: 1;
                }

                `
            }
            </style>
            <Scrollbar
                noScrollX
                style={{
                    flex: "1 1 auto",
                    minHeight: 0,
                    ...style,
                }}
                className="awesome-scroll"
                trackYProps={{
                    style: {
                        width: 6,
                        right: 2,
                        opacity: hovered ? 1: 0,
                        transition: "opacity 150ms ease",
                    },
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                thumbYProps={{
                    style: {
                        background: "rgba(58, 42, 29, 0.35)", // GoodLang text color
                        borderRadius: 8,
                    },
                }}
            >
                {children}
            </Scrollbar>
        </>
    );
}
