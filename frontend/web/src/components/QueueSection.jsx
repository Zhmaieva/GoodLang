export default function QueueSection({ queue, onGenerate, onStartPractice, fmtDateEnShort }) {
    return (
        <>
            <div className="section-title">Recommended vocabulary</div>
            <div className="queue-controls">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" onClick={onGenerate}>Words to learn</button>
                    <button className="btn secondary" onClick={onStartPractice}>Start practice</button>
                </div>
                <div className="sub" id="queueInfo">
                    {queue.length ? "Queue ready — click any word to start practicing."
                        : "Tip: click to generate 10 priority words."}
                </div>
            </div>

            <div className="queue-list">
                {queue.map((w, i) => {
                    let statusText = "New", chipCls = "chip new";
                    if (w.reason === "risk") { statusText = "Needs practice"; chipCls = "chip risk"; }
                    else if (w.reason === "learn") { statusText = "In progress"; chipCls = "chip learn"; }

                    return (
                        <div className="queue-item" key={w.word} onClick={() => alert("Start training word: " + w.word)}>
                            <div>
                                <strong>{i + 1}. {w.word} — {w.ua}</strong>
                                <div className="sub">Last seen: {fmtDateEnShort(w.lastSeen)}</div>
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