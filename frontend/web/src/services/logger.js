const FRONTEND_LOG_STORAGE_KEY = "goodlang_frontend_logs";

const MAX_LOG_ENTRIES = 500;
const MAX_MESSAGE_LENGTH = 12000;
const CAPTURED_CONSOLE_METHODS = ["debug", "log", "info", "warn", "error"];

const previousCapture = typeof window !== "undefined"
    ? window.__GOODLANG_FRONTEND_LOG_CAPTURE__
    : null;
const originalConsole = previousCapture?.originalConsole ?? Object.fromEntries(
    CAPTURED_CONSOLE_METHODS.map((method) => [
        method,
        console[method].bind(console),
    ])
);

function serializeValue(value) {
    if (value instanceof Error) {
        return [value.name, value.message, value.stack]
            .filter(Boolean)
            .join("\n");
    }

    if (typeof value === "string") return value;
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
    if (typeof value === "symbol") return value.toString();
    if (typeof value === "bigint") return `${value.toString()}n`;

    try {
        const seen = new WeakSet();
        return JSON.stringify(value, (_key, nestedValue) => {
            if (nestedValue instanceof Error) {
                return {
                    name: nestedValue.name,
                    message: nestedValue.message,
                    stack: nestedValue.stack,
                };
            }
            if (typeof nestedValue === "bigint") return `${nestedValue.toString()}n`;
            if (typeof nestedValue === "object" && nestedValue !== null) {
                if (seen.has(nestedValue)) return "[Circular]";
                seen.add(nestedValue);
            }
            return nestedValue;
        });
    } catch {
        try {
            return String(value);
        } catch {
            return "[Unserializable value]";
        }
    }
}

function readStoredLogs() {
    try {
        const entries = JSON.parse(localStorage.getItem(FRONTEND_LOG_STORAGE_KEY) || "[]");
        return Array.isArray(entries) ? entries : [];
    } catch {
        return [];
    }
}

function storeLogs(entries) {
    try {
        localStorage.setItem(FRONTEND_LOG_STORAGE_KEY, JSON.stringify(entries));
    } catch {
        try {
            localStorage.setItem(
                FRONTEND_LOG_STORAGE_KEY,
                JSON.stringify(entries.slice(-50))
            );
        } catch {
            // Logging must never interrupt the application.
        }
    }
}

function appendLog(level, values, source) {
    if (typeof localStorage === "undefined") return;

    const message = values
        .map(serializeValue)
        .join(" ")
        .slice(0, MAX_MESSAGE_LENGTH);
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        source,
        message,
    };
    const entries = readStoredLogs();
    entries.push(entry);
    storeLogs(entries.slice(-MAX_LOG_ENTRIES));

}

export function getFrontendLogs() {
    return readStoredLogs();
}

export function clearFrontendLogs() {
    try {
        localStorage.removeItem(FRONTEND_LOG_STORAGE_KEY);
    } catch {
        // Logging must never interrupt the application.
    }
}

function installFrontendLogCapture() {
    if (typeof window === "undefined") return;

    previousCapture?.cleanup?.();
    clearFrontendLogs();

    CAPTURED_CONSOLE_METHODS.forEach((method) => {
        console[method] = (...values) => {
            appendLog(method, values, "console");
        };
    });

    const handleWindowError = (event) => {
        appendLog("error", [
            event.message || "Uncaught frontend error",
            event.error || `${event.filename || "unknown"}:${event.lineno || 0}:${event.colno || 0}`,
        ], "window");
    };
    const handleUnhandledRejection = (event) => {
        appendLog("error", ["Unhandled promise rejection", event.reason], "promise");
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    window.__GOODLANG_FRONTEND_LOG_CAPTURE__ = {
        originalConsole,
        cleanup() {
            CAPTURED_CONSOLE_METHODS.forEach((method) => {
                console[method] = originalConsole[method];
            });
            window.removeEventListener("error", handleWindowError);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        },
    };
}

installFrontendLogCapture();

export function logInfo(...values) {
    appendLog("info", values, "logger");
}

export function logWarning(...values) {
    appendLog("warn", values, "logger");
}

export function logError(...values) {
    appendLog("error", values, "logger");
}
