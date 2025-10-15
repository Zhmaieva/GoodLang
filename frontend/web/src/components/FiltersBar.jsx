const LEVELS = ["all", "A1", "A2", "B1", "B2"];

export default function FiltersBar({
                                       filterLevel, onLevelChange,
                                       query, onQueryChange,
                                       showWeakOnly, onToggleWeak
                                   }) {
    return (
        <div className="filters">
            <div className="level-switch" role="group" aria-label="Фільтр рівня">
                {LEVELS.map(l => (
                    <button
                        key={l}
                        className={`pill ${filterLevel === l ? "selected" : ""}`}
                        aria-pressed={filterLevel === l}
                        onClick={() => onLevelChange(l)}
                    >
                        {l === "all" ? "Усі" : l}
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
            <button className={`pill ${showWeakOnly ? "selected" : ""}`} onClick={onToggleWeak}>
                {showWeakOnly ? "Показати всі" : "Лише слабкі"}
            </button>
        </div>
    );
}
