import GLButton from "../../components/GLButton.jsx";

export default function MyThing({
                                    theme,
                                    compact,
                                    expanded,
                                    taskMode,
                                    value,
                                    label,
                                    locked,
                                    taskModeLocked,
                                    loading,
                                    handleClick,
                                    getLabel,
                                }) {
    const lockedTooltipText = "Обирай формат завдань після оцінки рівня";

    return (
        <div>
            <GLButton
                theme={theme}
                compact={compact}
                selected={!expanded || taskMode === value}
                locked={locked}
                lockedTooltip={lockedTooltipText}
                leftIcon={!expanded ? (locked ? "lock" : "gear") : null}
                disabled={taskModeLocked}
                loading={loading}
                onClick={() => handleClick(value)}
            >
                {getLabel(label)}
            </GLButton>
        </div>
    );
}
