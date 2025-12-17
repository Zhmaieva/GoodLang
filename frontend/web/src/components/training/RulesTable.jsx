import { useState, useEffect } from "react";
import { statusOf } from "../pages/analyticsLogic.js";

export default function RulesTable({ rows, pct, statusOf, fmtDate, onRowClick }) {

    const LEVEL_MAP = {
        A1: { label: "Початківець" },
        A2: { label: "Середній" },
        B1: { label: "Середній" },
        B2: { label: "Просунутий" },
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const truncate = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };

    return (
        <div className="table" style={{ height: "100%" }} aria-live="polite">

            {/* DESKTOP HEADERS — залишаємо */}
            {!isMobile && (
                <div className="thead">
                    <div>#</div>
                    <div>Правило</div>
                    <div>Точність</div>
                    <div>Спроби</div>
                    <div>Остання практика</div>
                    <div className="col-last">Статус</div>
                </div>
            )}

            <div
                style={{
                    height: "100%",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: 36,
                }}
            >
                <div id="tbody">
                    {rows.map((r, idx) => {
                        const a = r.accuracy;
                        const st = statusOf(r);

                        const barColor =
                            r.status === "needs practice"
                                ? "#ef476f"
                                : r.status === "in progress"
                                    ? "#ffd166"
                                    : "#4ba36e";

                        /* ---------------- MOBILE CARD ---------------- */
                        if (isMobile) {
                            return (
                                <div
                                    key={r.ruleName}
                                    onClick={() => onRowClick(r)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                        padding: "18px 14px 10px 14px",
                                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                                        cursor: "pointer",
                                        textAlign: "left"
                                    }}
                                >


                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 18,
                                            ...truncate
                                        }}
                                    >
                                        {r.ruleName}
                                    </div>


                                    {/* ACCURACY + BAR */}
                                    <div style={{marginTop: 4, maxWidth: '200px'}}>
                                        <strong>{a}%</strong>
                                        <div className="bar" aria-label="bar">
                                            <i style={{
                                                width: `${a}%`,
                                                background: barColor
                                            }}/>
                                        </div>
                                    </div>

                                    {/* LEVEL */}
                                    <div style={{fontSize: 13, opacity: 0.7}}>
                                        Рівень: {LEVEL_MAP[r.level]?.label}
                                    </div>
                                    {/* ATTEMPTS */}
                                    <div style={{fontSize: 13, opacity: 0.7}}>
                                        Спроби: {r.attemptsNumber}
                                    </div>
                                    {/* ATTEMPTS */}
                                    <div style={{fontSize: 13, opacity: 0.7}}>
                                        Oстання практика: {fmtDate(r.lastAttemptDate)}
                                    </div>

                                </div>
                            );
                        }

                        /* ---------------- DESKTOP ROW ---------------- */
                        return (
                            <div
                                className="trow"
                                key={r.ruleName}
                                onClick={() => onRowClick(r)}
                            >
                                <div>{idx + 1}</div>
                                <div>
                                    <div className="rule-name">{r.ruleName}</div>
                                    <div className="sub">
                                        Рівень: {LEVEL_MAP[r.level]?.label}
                                    </div>
                                </div>
                                <div>
                                    <strong>{a}%</strong>
                                    <div className="bar">
                                        <i style={{ width: `${a}%`, background: barColor }} />
                                    </div>
                                </div>
                                <div>{r.attemptsNumber}</div>
                                <div>{fmtDate(r.lastAttemptDate)}</div>
                                <div className="col-last">
                                    <span className={`badge ${st.cls}`}>{st.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
