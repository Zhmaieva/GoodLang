export default function KPIGrid({ accuracy, attempts, masteredRules, learnedWords }) {
    return (
        <section className="grid" id="kpis">
            <div className="card kpi">
                <div className="label">Загальна точність</div>
                <div className="value">{accuracy ?? 0}%</div>
                <div className="spark"><i style={{ width: `${accuracy ?? 0}%` }} /></div>
            </div>
            <div className="card kpi">
                <div className="label">Всього відповідей</div>
                <div className="value">{attempts ?? 0}</div>
                <div className="spark"><i style={{ width: `${Math.min(100, attempts ?? 0)}%` }} /></div>
            </div>
            <div className="card kpi">
                <div className="label">Вивчені правила</div>
                <div className="value">{masteredRules ?? 0}</div>
                <div className="spark"><i style={{ width: `${Math.min(100, masteredRules ?? 0)}%` }} /></div>
            </div>
            <div className="card kpi">
                <div className="label">Вивчені слова</div>
                <div className="value">{learnedWords ?? 0}</div>
                <div className="spark"><i style={{ width: `${Math.min(100, learnedWords ?? 0)}%` }} /></div>
            </div>
        </section>
    );
}
