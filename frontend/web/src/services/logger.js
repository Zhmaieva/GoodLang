const logEnabled = !import.meta.env.PROD || false;

export function logInfo(text) {
    if (!logEnabled)
        return;

    console.log(text);
}

export function logWarning(text) {
    if (!logEnabled)
        return;

    console.warn(text);
}

export function logError(text) {
    if (!logEnabled)
        return;

    console.error(text);
}