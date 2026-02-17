// TeacherDashboardContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    apiTeacherMetadata,
    apiTeacherClasses,
    apiTeacherStudents,
    apiCreateClass,
    apiClassStudents,
    apiAddStudentToClass,
    apiDeactivateStudentInClass,
    apiRegenerateInviteCode,

    // ✅ додали
    apiRecommendedPreview,
} from "../../services/api.js";

const Ctx = createContext(null);

export function TeacherDashboardProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [teacher, setTeacher] = useState(null);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedRuleIds, setSelectedRuleIds] = useState([]);
    const [manualBuild, setManualBuild] = useState([]);
    const [builtTasksPreview, setBuiltTasksPreview] = useState([]);

    const [expandedClassId, setExpandedClassId] = useState(null);
    const [classStudentsMap, setClassStudentsMap] = useState({});
    const [classStudentsLoading, setClassStudentsLoading] = useState({});

    // ✅ recommended preview state (Step 2)
    const [recommendedPreview, setRecommendedPreview] = useState({
        loading: false,
        err: "",
        ready: false,
        data: null,
        key: "",
        seed: null,
        studentIds: [],
    });
    const [numberOfTasksPerStudent, _setNumberOfTasksPerStudent] = useState(10);
    const [taskMode, setTaskMode] = useState("translations");
    const [useRecommendedRules, setUseRecommendedRules] = useState(true);

// used to force reload when sliders/toggles change
    const [recommendedPreviewNonce, setRecommendedPreviewNonce] = useState(0);
    const setNumberOfTasksPerStudent = (n) => {
        const x = Math.max(1, Math.min(50, Number(n) || 10));
        _setNumberOfTasksPerStudent(x);
    };

    const restartRecommendedPreview = () => {
        setRecommendedPreviewNonce((x) => x + 1);
    };

    const [activePreviewStudentId, setActivePreviewStudentId] = useState("");

    const activeStudentsCount = Number(teacher?.active_students ?? 0);
    const quota = Number(teacher?.students_quota ?? 0);
    const isPro = teacher?.status === "Teacher+";
    const canAddStudents = isPro && quota > 0 && activeStudentsCount < quota;
    const isTeacherPlus = isPro;

    const quotaText = useMemo(() => {
        if (!teacher) return "";
        if (!isPro) return "План: FREE (додавання студентів недоступне)";
        if (quota <= 0) return "План: PRO (квота студентів: 0 — зверніться в підтримку)";
        return `План: PRO • Активні студенти: ${activeStudentsCount} / ${quota}`;
    }, [teacher, isPro, quota, activeStudentsCount]);

    async function reloadAll() {
        setLoading(true);
        setErr("");
        try {
            const [t, c, s] = await Promise.all([
                apiTeacherMetadata(),
                apiTeacherClasses(),
                apiTeacherStudents(),
            ]);
            setTeacher(t);
            setClasses(c?.classes || []);
            setStudents(s?.students || []);
        } catch (e) {
            setErr(e?.message || "Щось пішло не так");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadAll();
    }, []);

    async function loadClassStudents(classId) {
        setClassStudentsLoading((m) => ({ ...m, [classId]: true }));
        try {
            const data = await apiClassStudents(classId, "all");
            setClassStudentsMap((m) => ({ ...m, [classId]: data?.students || [] }));
        } finally {
            setClassStudentsLoading((m) => ({ ...m, [classId]: false }));
        }
    }

    async function onToggleExpandClass(classId) {
        setExpandedClassId((prev) => (prev === classId ? null : classId));
        const already = classStudentsMap[classId];
        if (!already) await loadClassStudents(classId);
    }

    async function onCreateClass(name) {
        const created = await apiCreateClass(name);
        const [c, t] = await Promise.all([apiTeacherClasses(), apiTeacherMetadata()]);
        setClasses(c?.classes || []);
        setTeacher(t);
        return created;
    }

    async function onRegenerateInviteCode(classId) {
        await apiRegenerateInviteCode(classId);
        const c = await apiTeacherClasses();
        setClasses(c?.classes || []);
    }

    async function onAddStudent(classId, payload) {
        const result = await apiAddStudentToClass(classId, payload);
        const [t, s] = await Promise.all([apiTeacherMetadata(), apiTeacherStudents()]);
        setTeacher(t);
        setStudents(s?.students || []);
        await loadClassStudents(classId);
        return result;
    }

    async function onDeactivateStudent(classId, studentAccountId) {
        await apiDeactivateStudentInClass(classId, studentAccountId);
        const [t, s] = await Promise.all([apiTeacherMetadata(), apiTeacherStudents()]);
        setTeacher(t);
        setStudents(s?.students || []);
        await loadClassStudents(classId);
    }

    // ✅ Step 2: load recommended preview and store in context
    async function loadRecommendedPreview({ studentIds, seed, key }) {
        const ids = Array.isArray(studentIds)
            ? studentIds.map(String).filter(Boolean)
            : [];

        // snapshot current slider value for this request
        const tasksPerStudent = Math.max(
            1,
            Math.min(50, Number(numberOfTasksPerStudent) || 10)
        );

        setRecommendedPreview((p) => ({
            ...p,
            loading: true,
            err: "",
            ready: false,
            key: key || "",
            seed: seed ?? null,
            studentIds: ids,

            // optional: store what we requested with (useful for debugging/UI)
            numberOfTasksPerStudent: tasksPerStudent,
        }));

        try {
            const data = await apiRecommendedPreview({
                studentIds: ids,
                seed,
                numberOfTasksPerStudent: tasksPerStudent,
            });

            setRecommendedPreview((p) => ({
                ...p,
                loading: false,
                err: "",
                ready: true,
                data,
            }));

            const firstId = String(data?.items?.[0]?.studentId || "");
            setActivePreviewStudentId((prev) => prev || firstId || "");
            return data;
        } catch (e) {
            setRecommendedPreview((p) => ({
                ...p,
                loading: false,
                err: e?.message || "Не вдалося завантажити рекомендації",
                ready: false,
                data: null,
            }));
            setActivePreviewStudentId("");
            throw e;
        }
    }

    function clearRecommendedPreview() {
        setRecommendedPreview({
            loading: false,
            err: "",
            ready: false,
            data: null,
            key: "",
            seed: null,
            studentIds: [],
        });
        setActivePreviewStudentId("");
    }

    const value = {
        // state
        loading,
        err,
        teacher,
        classes,
        students,
        expandedClassId,
        classStudentsMap,
        classStudentsLoading,

        // derived
        activeStudentsCount,
        quota,
        isPro,
        canAddStudents,
        quotaText,
        isTeacherPlus,

        // ✅ preview state
        recommendedPreview,
        activePreviewStudentId,
        selectedRuleIds,
        setSelectedRuleIds,
        manualBuild,
        setManualBuild,
        builtTasksPreview,
        setBuiltTasksPreview,

        // actions
        setErr,
        reloadAll,

        // ✅ preview actions
        setActivePreviewStudentId,
        numberOfTasksPerStudent,
        setNumberOfTasksPerStudent,
        taskMode,
        setTaskMode,
        useRecommendedRules,
        setUseRecommendedRules,
        recommendedPreviewNonce,
        restartRecommendedPreview,
    };

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTeacherDashboard() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useTeacherDashboard must be used inside TeacherDashboardProvider");
    return ctx;
}
