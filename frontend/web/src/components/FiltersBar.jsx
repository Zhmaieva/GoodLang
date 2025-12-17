import {useEffect, useState} from "react";

const LEVELS = [
    { id: "all", label: "Усі" },
    { id: "beginner", label: "Початківець" },
    { id: "intermediate", label: "Середній" },
    { id: "advanced", label: "Просунутий" },
];

export default function FiltersBar({
                                       filterLevel,
                                       onLevelChange,
                                       query,
                                       onQueryChange,
                                       showWeakOnly,
                                       onToggleWeak,
                                   }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <div className="filters">
            {!isMobile && <div
                className="level-switch"
                role="group"
                aria-label="Фільтр рівня"
                style={{
                    display: "flex",
                    gap: "8px",          // проміжок між кнопками
                    flexWrap: "wrap",     // щоб у мобільному переносило
                    justifyContent: "flex-start", // щоб не центровано
                }}
            >
                {LEVELS.map((lvl) => (
                    <button
                        key={lvl.id}
                        className={`pill ${filterLevel === lvl.id ? "selected" : ""}`}
                        aria-pressed={filterLevel === lvl.id}
                        onClick={() => onLevelChange(lvl.id)}
                        style={{
                            flexShrink: 1,          // дозволяємо стискатися
                            whiteSpace: "nowrap",   // текст в один рядок
                            overflow: "hidden",     // обрізати, що не влазить
                            textOverflow: "ellipsis", // три крапки
                            textAlign: "center",
                        }}
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>}

            <div className="search">
                <input
                    type="search"
                    placeholder={`Пошук правила…${isMobile ? '' : '(наприклад, Present Perfect, or, wish)'}`}
                    aria-label="Пошук правила"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                />
            </div>

            <button
                className={`pill ${showWeakOnly ? "selected" : ""}`}
                onClick={onToggleWeak}
            >
                {showWeakOnly ? "Показати всі" : "Лише слабкі"}
            </button>
        </div>
    );
}
