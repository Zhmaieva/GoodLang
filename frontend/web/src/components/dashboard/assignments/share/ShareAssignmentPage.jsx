// ShareAssignmentPage.jsx — STRICT mapping: query param "type" -> ASSIGNMENT_GROUPS item.url -> item.title
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../Page.jsx";
import Input from "../../Input.jsx";
import { theme } from "../../../../App.jsx";

import { apiBuildTaskSet, apiTeacherTaskSetTasks } from "../../../../services/api.js";
import { groups as ASSIGNMENT_GROUPS } from "../create/CreateAssignmentPage.jsx"; // ✅ your path

function parseRules(str) {
    if (!str) return [];
    return String(str)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseIntSafe(v, fallback) {
    const n = Number.parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) ? n : fallback;
}

function makeSeed() {
    return Math.floor(Math.random() * 1_000_000);
}

function pad2(n) {
    return String(n).padStart(2, "0");
}

function formatRuleReadable(ruleId) {
    if (!ruleId) return "";

    const result = String(ruleId)
        .toLowerCase()
        .split("_")
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase())

    return  `\"${result}\"`;
}

function formatTitleReadable(readableTypeTitle, ruleIds) {
    const d = new Date();
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();

    const rules = Array.isArray(ruleIds) ? ruleIds : [];

    let rulePart = "";

    if (rules.length > 0) {
        const formatted = rules.map(formatRuleReadable);

        if (formatted.length > 3) {
            rulePart =
                formatted.slice(0, 3).join(", ") + " and more";
        } else {
            rulePart = formatted.join(", ");
        }
    }

    return `${readableTypeTitle} (${rulePart}) ${dd}.${mm}.${yyyy}`.trim();
}


function resolveGroups(groupsExport) {
    // ASSIGNMENT_GROUPS in your file is a FUNCTION (export const groups = (() => { return [...] });)
    if (typeof groupsExport === "function") {
        const v = groupsExport();
        return Array.isArray(v) ? v : [];
    }
    return Array.isArray(groupsExport) ? groupsExport : [];
}

function formatTypeKeyReadable(key) {
    if (!key) return null;

    return String(key)
        .trim()
        .toLowerCase()
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function getReadableTitleStrictByTypeParam(typeParam) {
    const type = String(typeParam || "").trim();
    if (!type) return null;

    const groupsArr = resolveGroups(ASSIGNMENT_GROUPS);

    for (const g of groupsArr) {
        for (const it of g?.items || []) {
            // ✅ STRICT: ONLY match by item.url === type
            if (String(it?.url || "").trim() === type) {
                return formatTypeKeyReadable(it.url);
            }
        }
    }

    return null;
}

export function ShareAssignmentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const qp = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // ✅ incoming params (from create page)
    const typeParam = qp.get("type") || "";               // e.g. "grammar-choose-option"
    const taskMode = String(qp.get("taskMode") || "").trim(); // e.g. "gaps"
    const numberOfTasks = parseIntSafe(qp.get("tasks"), 10);
    const ruleIds = parseRules(qp.get("rules"));
    const seedFromUrl = qp.get("seed");

    // ✅ id param (after build)
    const taskSetIdFromUrl = qp.get("taskSetId") || "";

    // ✅ strict readable title from groups (NO fallback)
    const readableTypeTitle = useMemo(() => {
        return getReadableTitleStrictByTypeParam(typeParam);
    }, [typeParam]);

    // local state
    const [taskName, setTaskName] = useState("");

    const [taskSetId, setTaskSetId] = useState(taskSetIdFromUrl || "");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // keep taskSetId state in sync if user opens URL with taskSetId
    useEffect(() => {
        if (taskSetIdFromUrl && taskSetIdFromUrl !== taskSetId) {
            setTaskSetId(taskSetIdFromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskSetIdFromUrl])

    useEffect(() => {
        let cancelled = false;

        async function run() {
            // -------------------------
            // CASE A: have id -> fetch tasks
            // -------------------------
            if (taskSetIdFromUrl) {
                setLoading(true);
                try {
                    const resp = await apiTeacherTaskSetTasks({ taskSetId: taskSetIdFromUrl });
                    if (cancelled) return;
                    setTasks(resp?.tasks || []);
                    setTaskSetId(taskSetIdFromUrl);
                    setTaskName(resp.title);
                } finally {
                    if (!cancelled) setLoading(false);
                }
                return;
            }

            // -------------------------
            // CASE B: no id -> build
            // STRICT requirement:
            // - type MUST map to groups (readableTypeTitle must exist)
            // - AND must have taskMode, rules, numberOfTasks
            // -------------------------
            if (!readableTypeTitle) return;
            if (!taskMode || !ruleIds.length || !numberOfTasks) return;

            setLoading(true);
            try {
                const seed = Number.isFinite(Number(seedFromUrl)) ? Number(seedFromUrl) : makeSeed();
                const title = taskName || formatTitleReadable(readableTypeTitle, ruleIds);

                const created = await apiBuildTaskSet({
                    taskMode,          // ✅ ONLY from query param
                    ruleIds,
                    numberOfTasks,
                    seed,
                    title,
                });

                if (cancelled) return;

                const newId = created?.taskSetId;
                setTaskSetId(newId || "");
                setTasks(created?.tasks || []);

                // ✅ clear ALL other params, keep only taskSetId
                if (newId) {
                    navigate(`${location.pathname}?taskSetId=${encodeURIComponent(newId)}`, { replace: true });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };

        // IMPORTANT: do NOT include taskName (typing must not rebuild)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        taskSetIdFromUrl,
        readableTypeTitle,
        taskMode,
        numberOfTasks,
        ruleIds.join(","),
        seedFromUrl,
        navigate,
        location.pathname,
    ]);

    // Layout (two columns like your create pages)
    const t = theme.createGrammarChooseOption;

    const styles = useMemo(
        () => ({
            row: {
                display: "flex",
                gap: t.rowGap,
                width: t.full,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                marginTop: theme.bottomDynamicList.padBottom,
            },
            left: {
                width: t.leftWidth,
                minWidth: t.minH0,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },
            right: {
                flex: "1 1 auto",
                minWidth: t.minH0,
                height: t.rightHeight,
                maxWidth: t.rightMaxWidth,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },
            inputWrap: {
                paddingLeft: theme.bottomDynamicList.padX * 2,
                paddingBottom: theme.bottomDynamicList.padTop,
                width: "80%",
                opacity: taskName ? 1 : 0,
                transition: "opacity 0.3s"
            },
        }),
        [taskName]
    );

    return (
        <Page
            title={"Share assignment"}
            subtitle={
                "Instantly share with anyone using the code or the link. " +
                "Or, simply send it to any existent students or classes"
            }
        >
            <div style={styles.row}>
                {/* LEFT: task name input */}
                <div style={styles.left}>
                    <div style={styles.inputWrap}>
                        <Input
                            title={"Assignment name (visible to students)"}
                            placeholder={`e.g. "Homework for Sally"`}
                            mode="raw"
                            charLimit={120}
                            value={taskName}
                            onChange={setTaskName}
                        />

                        {/* Optional: if strict mapping failed, you may want a tiny hint (remove later) */}
                        {/* {!readableTypeTitle && (
                            <div style={{ opacity: 0.6, marginTop: 8 }}>
                                Unknown assignment type. Missing or invalid ?type=
                            </div>
                        )} */}
                    </div>
                </div>

                {/* RIGHT: blank for now */}
                <div style={styles.right} />
            </div>
        </Page>
    );
}
