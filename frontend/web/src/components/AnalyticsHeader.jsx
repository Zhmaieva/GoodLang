
export default function AnalyticsHeader({ onBack, onExport }) {
    return (
        <header>
            <div className="brand">
                <div className="logo" aria-hidden="true">GL</div>
                <div>
                    <h1>GoodLang</h1>
                    <div className="sub">
                        Progress overview and list of rules
                    </div>
                </div>
            </div>
            <nav className="actions">
                <button className="btn secondary" onClick={onBack}>← Practice</button>
                {/*<button className="btn" onClick={onExport}>Роздрукувати результати</button>*/}
            </nav>
        </header>
    );
}
