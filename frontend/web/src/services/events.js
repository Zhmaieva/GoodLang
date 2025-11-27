// Very tiny event bus
const listeners = {};

export function on(event, cb) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(cb);
}

export function off(event, cb) {
    listeners[event] = (listeners[event] || []).filter(fn => fn !== cb);
}

export function emit(event, payload) {
    (listeners[event] || []).forEach(fn => fn(payload));
}
