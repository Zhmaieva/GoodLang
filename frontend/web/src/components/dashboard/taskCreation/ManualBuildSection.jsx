// ManualBuildSection.jsx
import React, { useMemo } from "react";
import ManualBuildToolbar from "./components/ManualBuildToolbar.jsx";
import RulesSelectorTable from "./components/RulesSelectorTable.jsx";
import BuiltTasksPreview from "./components/BuiltTasksPreview.jsx";

/**
 * EXPECTS from context props:
 * - rules: array
 * - selectedRuleIds, setSelectedRuleIds
 * - manualBuild, setManualBuild
 * - setBuiltTasksPreview (optional)
 */
export default function ManualBuildSection({
                                               rules = [],
                                               selectedRuleIds,
                                               setSelectedRuleIds,
                                               manualBuild,
                                               setManualBuild,
                                               setBuiltTasksPreview, // optional: push build result to context
                                           }) {
    const TOKENS = useMemo(
        () => ({
            gap: 14,
        }),
        []
    );

    return (
        <div style={{ display: "flex", gap: TOKENS.gap, alignItems: "stretch", height: "99%" }}>
            {/* 20% */}
            <div style={{ flex: "0 0 20%", minWidth: 240, height: '100%' }}>
                <ManualBuildToolbar
                    manualBuild={manualBuild}
                    setManualBuild={setManualBuild}
                    selectedRuleIdsCount={(selectedRuleIds || []).length}
                />
            </div>

            {/* 30% */}
            <div style={{ flex: "0 0 40%", minWidth: 340 }}>
                <RulesSelectorTable
                    rules={rules}
                    selectedRuleIds={selectedRuleIds}
                    setSelectedRuleIds={setSelectedRuleIds}
                    height="72vh"
                />
            </div>

            {/* r§t */}
            <div style={{ flex: "1 1 auto", minWidth: 340 }}>
                <BuiltTasksPreview
                    selectedRuleIds={selectedRuleIds}
                    manualBuild={manualBuild}
                    onBuilt={(data) => {
                        if (!setBuiltTasksPreview) return;
                        setBuiltTasksPreview((prev) => ({
                            ...(prev || {}),
                            isLoading: false,
                            taskSetId: data?.taskSetId ?? null,
                            tasks: Array.isArray(data?.tasks) ? data.tasks : [],
                            error: null,
                            lastBuildKey: `${Date.now()}`,
                        }));
                    }}
                    height="72vh"
                />
            </div>
        </div>
    );
}
