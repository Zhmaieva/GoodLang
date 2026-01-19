import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getTeacherMetadata,
    listTeachersClasses,
    listTeachersStudents,
    listClassStudents,
    createClass,
    regenerateClassInviteCode,
    addStudentToClassByEmail,
    deactivateStudentInClass,
    acceptInvitationByCode,
    getTeacherMetadataByClassIdForStudent,
    listClassesByStudentId,
    leaveClass,
} from "../database/repositories/teacherClassesRepository.js";

const name = "schools";

function requireBodyFields(body, fields) {
    for (const f of fields) {
        if (body?.[f] === undefined || body?.[f] === null || body?.[f] === "") {
            return f;
        }
    }
    return null;
}

export const schoolController = {
    mapRoutes: function (app) {
        // =========================
        // TEACHER endpoints (me)
        // =========================

        // Get teacher metadata (me)
        app.get(`/${name}/teachers/me`, authMiddleware, async (req, res, next) => {
            try {
                const meta = await getTeacherMetadata(req.user.id);
                if (!meta) return res.status(404).json({ error: "Teacher not found" });
                res.json(meta);
            } catch (e) {
                next(e);
            }
        });

        // List teacher classes
        app.get(`/${name}/teachers/me/classes`, authMiddleware, async (req, res, next) => {
            try {
                const rows = await listTeachersClasses(req.user.id);
                res.json({ classes: rows });
            } catch (e) {
                next(e);
            }
        });

        // Create class
        app.post(`/${name}/teachers/me/classes`, authMiddleware, async (req, res, next) => {
            try {
                const missing = requireBodyFields(req.body, ["name"]);
                if (missing) return res.status(400).json({ error: `${missing} required` });

                const created = await createClass(req.user.id, String(req.body.name).trim());
                res.status(201).json(created);
            } catch (e) {
                next(e);
            }
        });

        // Regenerate invitation code
        app.post(
            `/${name}/teachers/me/classes/:classId/invitation-codes`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const updated = await regenerateClassInviteCode(req.user.id, req.params.classId);
                    if (!updated) return res.status(404).json({ error: "Class not found" });
                    res.json(updated);
                } catch (e) {
                    next(e);
                }
            }
        );

        // List teacher students (across all classes)
        app.get(`/${name}/teachers/me/students`, authMiddleware, async (req, res, next) => {
            try {
                const rows = await listTeachersStudents(req.user.id);
                res.json({ students: rows });
            } catch (e) {
                next(e);
            }
        });

        // List single class students (both active and inactive by default)
        // Optional filter: ?is_active=true|false|all
        app.get(
            `/${name}/teachers/me/classes/:classId/students`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const q = String(req.query?.is_active || "all").toLowerCase();
                    const activeFilter = q === "true" ? true : q === "false" ? false : null;

                    const rows = await listClassStudents(req.user.id, req.params.classId, activeFilter);
                    // if class not owned, repository returns empty; we keep it safe:
                    res.json({ students: rows });
                } catch (e) {
                    next(e);
                }
            }
        );

        // Add student to class by email (quota-safe)
        app.post(
            `/${name}/teachers/me/classes/:classId/students`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const missing = requireBodyFields(req.body, ["email"]);
                    if (missing) return res.status(400).json({ error: `${missing} required` });

                    const result = await addStudentToClassByEmail({
                        teacherAccountId: req.user.id,
                        classId: req.params.classId,
                        email: req.body.email,
                        firstName: req.body.firstName ?? null,
                        lastName: req.body.lastName ?? null,
                    });

                    if (!result.ok) {
                        if (result.reason === "quota_exceeded") {
                            return res.status(403).json({
                                error: "Teacher quota exceeded",
                                quota: result.quota,
                                activeStudents: result.activeStudents,
                            });
                        }
                        if (result.reason === "class_not_found_or_not_owned") {
                            return res.status(404).json({ error: "Class not found" });
                        }
                        return res.status(400).json({ error: result.reason });
                    }

                    res.status(201).json(result);
                } catch (e) {
                    next(e);
                }
            }
        );

        // Deactivate student in a class
        app.delete(
            `/${name}/teachers/me/classes/:classId/students/:studentAccountId`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const result = await deactivateStudentInClass(
                        req.user.id,
                        req.params.classId,
                        req.params.studentAccountId
                    );

                    if (!result.ok && result.reason === "class_not_found_or_not_owned") {
                        return res.status(404).json({ error: "Class not found" });
                    }

                    // ok=false may also mean membership didn't exist
                    res.json(result);
                } catch (e) {
                    next(e);
                }
            }
        );

        // =========================
        // STUDENT endpoints (me)
        // =========================

        // Accept invite code
        app.post(`/${name}/students/me/classes`, authMiddleware, async (req, res, next) => {
            try {
                const missing = requireBodyFields(req.body, ["inviteCode"]);
                if (missing) return res.status(400).json({ error: `${missing} required` });

                const result = await acceptInvitationByCode(req.user.id, req.body.inviteCode);

                if (!result.ok) {
                    if (result.reason === "invalid_code") return res.status(400).json({ error: "Invalid code" });
                    return res.status(400).json({ error: result.reason });
                }

                res.status(201).json(result);
            } catch (e) {
                next(e);
            }
        });

        // List my classes
        app.get(`/${name}/students/me/classes`, authMiddleware, async (req, res, next) => {
            try {
                const rows = await listClassesByStudentId(req.user.id);
                res.json({ classes: rows });
            } catch (e) {
                next(e);
            }
        });

        // Leave a class (deactivate membership)
        app.post(
            `/${name}/students/me/classes/:classId/leave`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const result = await leaveClass(req.user.id, req.params.classId);
                    res.json(result);
                } catch (e) {
                    next(e);
                }
            }
        );

        // Get teacher metadata by classId (student must be a member)
        app.get(
            `/${name}/students/me/classes/:classId/teachers/metadata`,
            authMiddleware,
            async (req, res, next) => {
                try {
                    const meta = await getTeacherMetadataByClassIdForStudent(req.user.id, req.params.classId);
                    if (!meta) return res.status(404).json({ error: "Not found" });
                    res.json(meta);
                } catch (e) {
                    next(e);
                }
            }
        );
    },
};
