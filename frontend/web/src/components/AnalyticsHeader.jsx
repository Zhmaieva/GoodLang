import { Button } from "./Buttons.jsx";
import { ArrowLeft } from "@phosphor-icons/react";

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
                <Button className="btn secondary" onClick={onBack}>
                    <ArrowLeft size={18} weight="bold" aria-hidden />
                    Practice
                </Button>
                {/*<Button className="btn" onClick={onExport}>Роздрукувати результати</Button>*/}
            </nav>
        </header>
    );
}
