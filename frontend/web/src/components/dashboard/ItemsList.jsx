import React, { useEffect, useMemo, useRef, useState } from "react";
import ItemCard from "./ItemCard";
import { theme } from "../../App.jsx";

export default function ItemsList({
                                      items = [],
                                      defaultSelectedId,
                                      onSelect, // (item, meta) => void
                                      selectedShift = true,
                                      style,
                                  }) {
    const [selectedId, setSelectedId] = useState(defaultSelectedId ?? null);
    const prevSelectedIdRef = useRef(selectedId);

    useEffect(() => {
        if (!selectedId) return;
        const exists = items.some((it) => String(it.id) === String(selectedId));
        if (!exists) setSelectedId(null);
    }, [items, selectedId]);

    const styles = useMemo(() => {
        return {
            wrap: {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                padding: theme.spacing.listPad,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.rowGap,
                WebkitOverflowScrolling: "touch",
                fontFamily: theme.fontFamily,
            },
            inner: {
                width: "100%",
                paddingRight: theme.spacing.listInnerRightPad,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.rowGap,
            },
            empty: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.empty,
                color: "rgba(18,18,18,0.6)",
                padding: "0.75rem",
            },
        };
    }, []);

    function handlePick(item) {
        const nextId = item?.id ?? null;
        const prevId = prevSelectedIdRef.current ?? null;

        setSelectedId(nextId);
        prevSelectedIdRef.current = nextId;

        onSelect?.(item, {
            selectedId: nextId,
            prevSelectedId: prevId,
            changed: String(prevId) !== String(nextId),
        });
    }

    return (
        <div style={{ ...styles.wrap, ...style }}>
            <div style={styles.inner}>
                {items.length === 0 ? (
                    <div style={styles.empty}>No items</div>
                ) : (
                    items.map((it) => (
                        <ItemCard
                            key={it.id}
                            title={it.title}
                            subtitle={it.subtitle}
                            imageUrl={it.imageUrl}
                            selected={String(it.id) === String(selectedId)}
                            selectedShift={selectedShift}
                            onClick={() => handlePick(it)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
