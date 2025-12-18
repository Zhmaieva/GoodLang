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

export async function getUserId() {
    return (await initCredentials()).userId;
}

export async function getToken() {
    return (await initCredentials()).token;
}

/* todo:
- fix dates translation
- fix declarative sentences absent level and others

- TOU

- add email/number input type and enter
- add a progress bar to the rule page
- add ordering in the rules table
 */
