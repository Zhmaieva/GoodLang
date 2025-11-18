import {statusOf} from "./pages/analyticsLogic.js";

export default function RulesTable({ rows, pct, statusOf, fmtDate, onRowClick }) {
    const LEVEL_MAP = {
        A1: { label: "Початківець", percent: 33 },
        A2: { label: "Середній", percent: 66 },
        B1: { label: "Середній", percent: 66 },
        B2: { label: "Просунутий", percent: 100 },
    };

    return (
        <div className="table" aria-live="polite">
            <div className="thead">
                <div>#</div>
                <div>Правило</div>
                <div>Точність</div>
                <div>Спроби</div>
                <div>Остання практика</div>
                <div className="col-last">Статус</div>
            </div>
            <div id="tbody">
                {rows.map((r, idx) => {
                    const a = r.accuracy;
                    let st = statusOf(r);
                    const barColor = r.status === 'needs practice' ? "#ef476f" : r.status === 'in progress' ? "#ffd166" : "#4ba36e";
                    return (
                        <div className="trow" onClick={() => {
                            onRowClick(r)
                        }} key={r.ruleName}>
                            <div>{idx + 1}</div>
                            <div>
                                <div className="rule-name">{r.ruleName}</div>
                                <div className="sub">Рівень: {LEVEL_MAP[Object.keys(LEVEL_MAP).find(x => x === r.level)]?.label}</div>
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <strong>{a}%</strong>
                                </div>
                                <div className="bar" aria-label="Прогрес">
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
    );
}
