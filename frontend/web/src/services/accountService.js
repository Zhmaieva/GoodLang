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
- add weights to favour more recent results in global analytics
- add weights to favour more recent results in training director
- mobile page
 */
