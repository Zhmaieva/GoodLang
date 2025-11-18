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
- show timer when quota reached
- add to dashboard: improvements rate over week or less
- add to dashboard: days to the next level/learning streak
- add to dashboard: current level
- automatically suggest level
- fix analytics accuracy with weight distribution
- rule practice in analytics page

- update rules dictionary
 */
