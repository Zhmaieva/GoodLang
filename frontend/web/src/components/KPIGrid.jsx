import {inferUserLevel} from "../services/dataService.js";

export default function KPIGrid({ accuracy, attempts, masteredRules, userLevel }) {

    const LEVEL_MAP = {
        A1: { label: "Початківець", percent: 33 },
        A2: { label: "Середній", percent: 66 },
        B1: { label: "Середній", percent: 66 },
        B2: { label: "Просунутий", percent: 100 },
    };

    const inferred = userLevel?.level || "A1";
    const levelInfo = LEVEL_MAP[inferred] || LEVEL_MAP.beginner;

    return (
        <section className="grid" id="kpis">
            <div className="card kpi">
                <div className="label">Загальна точність</div>
                <div className="value">{accuracy ?? 0}%</div>
                <div className="spark"><i style={{width: `${accuracy ?? 0}%`}}/></div>
            </div>
            <div className="card kpi">
                <div className="label">Всього відповідей</div>
                <div className="value">{attempts ?? 0}</div>
                <div className="spark"><i style={{width: `${Math.min(100, attempts ?? 0)}%`}}/></div>
            </div>
            <div className="card kpi">
                <div className="label">Вивчені правила</div>
                <div className="value">{masteredRules ?? 0}</div>
                <div className="spark"><i style={{width: `${Math.min(100, masteredRules ?? 0)}%`}}/></div>
            </div>
            <div className="card kpi">
                <div className="label">Рівень</div>
                <div className="value">{levelInfo?.label}</div>
                <div className="spark">
                    <i style={{width: `${levelInfo?.percent ?? 0}%`}}/>
                </div>
            </div>
        </section>
    );
}
