// sections/AssignmentsListSection.jsx
import React, { useRef, useEffect } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function AssignmentsListSection({
                                                   assignments = [],
                                                   loading,
                                                   selectedId,
                                                   onSelect,
                                                   onLoadMore,
                                                   onAdd,
                                               }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!onLoadMore) return;
        const el = scrollRef.current;
        if (!el) return;

        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 140) onLoadMore();
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [onLoadMore]);

    const TOKENS = {
        bg: "rgba(255,255,255,0.10)",        // like other sections
        rowBg: "rgba(255,255,255,0.65)",
        rowBgActive: "rgba(255,255,255,0.82)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        accent: "#ff6138",
        radius: 18,
    };

    return (
        <AwesomeCard
            title="Assignments"
            right={<AwesomeButton onClick={onAdd}>Create an assignment</AwesomeButton>}
            style={{ flex: 1, position: "relative" }}
        >
            <div
                ref={scrollRef}
                style={{
                    height: "100%",
                    minHeight: 0,
                    overflowY: "auto",
                    paddingRight: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontFamily: "Nunito, ui-sans-serif, system-ui",
                }}
            >
                {!assignments?.length && !loading ? (
                    <div
                        style={{
                            border: `1px solid ${TOKENS.border}`,
                            background: TOKENS.bg,
                            borderRadius: TOKENS.radius,
                            padding: 12,
                            fontWeight: 900,
                            color: TOKENS.muted,
                            textAlign: "center",
                        }}
                    >
                        No assignments yet.
                    </div>
                ) : null}

                {assignments.map((a) => {
                    const id = String(a?.id ?? "");
                    const active = id && String(selectedId) === id;

                    return (
                        <button
                            key={id || a.title}
                            type="button"
                            onClick={() => onSelect?.(a)}
                            style={{
                                all: "unset",
                                cursor: "pointer",
                                display: "block",
                                borderRadius: TOKENS.radius,
                                border: active ? `2px solid ${TOKENS.accent}` : `1px solid ${TOKENS.border}`,
                                background: active ? TOKENS.rowBgActive : TOKENS.rowBg,
                                padding: 12,
                                boxShadow: "none",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 1000,
                                    color: TOKENS.text,
                                    lineHeight: 1.15,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={a?.title || ""}
                            >
                                {a?.title || "Untitled assignment"}
                            </div>

                            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <Pill>
                                    Tasks: <b>{Number(a?.tasksCount ?? 0)}</b>
                                </Pill>
                                <Pill>
                                    Assigned: <b>{Number(a?.assigned ?? 0)}</b>
                                </Pill>
                            </div>

                            {/* small meta (optional) */}
                            {a?.createdAt ? (
                                <div
                                    style={{
                                        marginTop: 8,
                                        fontSize: 12,
                                        fontWeight: 900,
                                        color: TOKENS.muted,
                                        opacity: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    title={String(a.createdAt)}
                                >
                                    Created: {new Date(a.createdAt).toLocaleString()}
                                </div>
                            ) : null}
                        </button>
                    );

                    function Pill({ children }) {
                        return (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "baseline",
                                    gap: 6,
                                    padding: "4px 8px",
                                    borderRadius: 999,
                                    border: `1px solid ${TOKENS.border}`,
                                    background: active ? "rgba(255,97,56,0.10)" : "rgba(0,0,0,0.03)",
                                    fontSize: 12,
                                    fontWeight: 900,
                                    color: TOKENS.text,
                                }}
                            >
                {children}
              </span>
                        );
                    }
                })}

                {loading ? (
                    <div
                        style={{
                            border: `1px dashed ${TOKENS.border}`,
                            background: "rgba(255,255,255,0.35)",
                            borderRadius: TOKENS.radius,
                            padding: 12,
                            fontWeight: 900,
                            color: TOKENS.muted,
                            textAlign: "center",
                        }}
                    >
                        Loading…
                    </div>
                ) : null}
            </div>
        </AwesomeCard>
    );
}
