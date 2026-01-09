
export default function AnalyticsHeader({ onBack, onExport }) {
    return (
        <header>
            <div className="brand">
                <div className="logo" aria-hidden="true">GL</div>
                <div>
                    <h1>GoodLang</h1>
                    <div className="sub">
                        Огляд прогресу та список правил
                    </div>
                </div>
            </div>
            <nav className="actions">
                <button className="btn secondary" onClick={onBack}>← Практика</button>
                {/*<button className="btn" onClick={onExport}>Роздрукувати результати</button>*/}
            </nav>
        </header>
    );
}
