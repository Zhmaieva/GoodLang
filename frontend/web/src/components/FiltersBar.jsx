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
    return (
        <div className="filters">
            <div className="level-switch" role="group" aria-label="Фільтр рівня">
                {LEVELS.map((lvl) => (
                    <button
                        key={lvl.id}
                        className={`pill ${filterLevel === lvl.id ? "selected" : ""}`}
                        aria-pressed={filterLevel === lvl.id}
                        onClick={() => onLevelChange(lvl.id)}
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>

            <div className="search">
                <input
                    type="search"
                    placeholder="Пошук правила… (наприклад, Present Perfect, or, wish)"
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
