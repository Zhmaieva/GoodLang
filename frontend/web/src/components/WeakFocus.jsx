export default function WeakFocus({ rows, pct, statusOf, fmtDate }) {
    const bads = rows.filter(r => statusOf(r).cls === "bad");
    if (!bads.length) {
        return (
            <>
                <div className="section-title">Правило для практики</div>
                <div className="weak-list">
                    <div className="focus-card">
                        <div className="focus-head">
                            <strong>Немає правил у «червоній зоні» 🎉</strong>
                        </div>
                        <div className="focus-meta">
                            Продовжуйте практику — система підсвітить правило, яке потребує уваги, щойно воно зʼявиться.
                        </div>
                    </div>
                </div>
            </>
        );
    }

    bads.sort(
        (a, b) =>
            a.correct / a.attempts - b.correct / b.attempts ||
            new Date(b.lastSeen) - new Date(a.lastSeen)
    );
    const r = bads[0];
    const a = pct(r.correct, r.attempts);

    return (
        <>
            <div className="section-title">Правило для практики</div>
            <div className="weak-list">
                <div className="focus-card">
                    <div className="focus-head">
                        <strong>{r.name}</strong>
                        <span className="badge bad">{a}%</span>
                    </div>
                    <div className="focus-meta">
                        Рівень: {r.level} • Спроб: {r.attempts} • Остання практика: {fmtDate(r.lastSeen)}
                    </div>
                    <div className="bar" style={{ marginTop: 8 }}>
                        <i style={{ width: `${a}%`, background: "#ef476f" }} />
                    </div>
                    <div className="focus-actions">
                        <button className="pill">Пояснення правила</button>
                        <button className="pill">Почати практику</button>
                    </div>
                </div>
            </div>
        </>
    );
}
