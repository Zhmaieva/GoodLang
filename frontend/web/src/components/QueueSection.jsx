export default function QueueSection({ queue, onGenerate, onStartPractice, fmtDateEnShort }) {
    return (
        <>
            <div className="section-title">Рекомендовані слова для вивчення</div>
            <div className="queue-controls">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" onClick={onGenerate}>Слова для вивчення</button>
                    <button className="btn secondary" onClick={onStartPractice}>Почати практику</button>
                </div>
                <div className="sub" id="queueInfo">
                    {queue.length ? "Черга зібрана — натисніть будь-яке слово, щоб перейти до практики."
                        : "Порада: натисніть, щоб система зібрала 10 пріоритетних слів."}
                </div>
            </div>

            <div className="queue-list">
                {queue.map((w, i) => {
                    let statusText = "Нове", chipCls = "chip new";
                    if (w.reason === "risk") { statusText = "Потребує практики"; chipCls = "chip risk"; }
                    else if (w.reason === "learn") { statusText = "У процесі"; chipCls = "chip learn"; }

                    return (
                        <div className="queue-item" key={w.word} onClick={() => alert("Почати тренування слова: " + w.word)}>
                            <div>
                                <strong>{i + 1}. {w.word} — {w.ua}</strong>
                                <div className="sub">Останнє: {fmtDateEnShort(w.lastSeen)}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span className={chipCls}>{statusText}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
