import {callSignUpApi} from "./api.js";
import {emit} from "./events.js";

let initPromise = null;

async function initCredentials() {
    // fast path
    const savedToken = localStorage.getItem("token");
    if (savedToken) return { token: savedToken };

    // if already initializing, wait for it
    if (initPromise) return initPromise;

    // create single in-flight init
    initPromise = (async () => {
        // re-check inside the lock (important)
        const again = localStorage.getItem("token");
        if (again) return { token: again };

        const { token } = await callSignUpApi();
        localStorage.setItem("token", token);

        //emit("onFirstOpen", {});

        return { token };
    })();

    try {
        return await initPromise;
    } finally {
        // allow future re-init attempts if needed
        initPromise = null;
    }
}

export async function getToken() {
    const { token } = await initCredentials();
    return token;
}

setInterval(() => {
    emit("refreshAccount")
}, 5000);

/* todo:
- overall accuracy redesign (header mode)
- marathon progress bar

- trainer redesign
- trainer result redesign

- modal on marathon day summary

- certificate on marathon completion
- email on marathon completion
- job to change marathon status

- modal on marathon fail (only once on active session)
- modal on marathon base tasks completion
- modal on marathon full tasks completion
- modal on marathon completion (only once on active session)

- add product limitation to automatic promo code on prod before releasing marathon
- update ToU for marathons

- add a progress bar to the rule page
- add ordering in the rules table
- add email/number input type and enter
 */
