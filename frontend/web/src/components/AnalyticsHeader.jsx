import {useNavigate} from "react-router-dom";

export default function AnalyticsHeader({ onBack, onExport }) {
    return (
        <header>
            <div className="brand">
                <div className="logo" aria-hidden="true">GL</div>
                <div>
                    <h1>Аналітика GoodLang</h1>
                    <div className="sub">
                        Огляд прогресу за правилами та словами: що вже засвоєно, а що варто потренувати.
                    </div>
                </div>
            </div>
            <nav className="actions">
                <button className="btn secondary" onClick={onBack}>← Практика</button>
                <button className="btn" onClick={onExport}>Роздрукувати результати</button>
            </nav>
        </header>
    );
}
