import {callSignUpApi} from "./api.js";

async function initCredentials() {
    const savedToken = localStorage.getItem("token");
    const savedId = localStorage.getItem("userId");
    if (!savedToken || !savedId) {
        const { userId, token } = await callSignUpApi();
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        return { userId, token };
    }
    return { token: savedToken, userId: savedId};
}

export async function getToken() {
    return (await initCredentials()).token;
}

/* todo:
- get account status (free/paid)
- show modal when limit reached on 'verify' button press
- create account (activate subscription)
- account not paid subscription
- account return to paid subscription
- change payment method
- cancel subscription
- sign in to another account
 */
