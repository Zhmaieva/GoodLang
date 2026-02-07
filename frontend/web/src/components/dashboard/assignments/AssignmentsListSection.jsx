// sections/AssignmentsListSection.jsx
import React, { useRef, useEffect } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function AssignmentsListSection({
                                                   assignments,
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

        const onScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
                onLoadMore();
            }
        };

        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [onLoadMore]);

    return (
        <AwesomeCard
            title="Assignments"
            right={<AwesomeButton onClick={onAdd}>Add homework</AwesomeButton>}
            style={{ flex: 1 }}
        >
            <div ref={scrollRef} style={{ overflowY: "auto", height: "100%" }}>
                {assignments.map((a) => {
                    const active = a.id === selectedId;
                    return (
                        <div
                            key={a.id}
                            onClick={() => onSelect(a)}
                            style={{
                                padding: 12,
                                border: active ? "2px solid #ff6138" : "1px solid rgba(0,0,0,0.15)",
                                marginBottom: 8,
                                cursor: "pointer",
                                background: "rgba(255,255,255,0.65)",
                            }}
                        >
                            <div style={{ fontWeight: 900 }}>{a.title}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>
                                Tasks: {a.tasksCount} · Assigned: {a.assigned}
                            </div>
                        </div>
                    );
                })}

                {loading && <div style={{ padding: 12 }}>Loading…</div>}
            </div>
        </AwesomeCard>
    );
}
