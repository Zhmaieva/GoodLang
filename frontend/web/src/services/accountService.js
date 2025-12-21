import {callSignUpApi} from "./api.js";

async function initCredentials() {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
        const { token } = await callSignUpApi();
        localStorage.setItem("token", token);
        return { token };
    }
    return { token: savedToken };
}

export async function getToken() {
    return (await initCredentials()).token;
}

/* todo:
- fix declarative sentences absent level and others
- fix dates translation

- add a progress bar to the rule page
- add ordering in the rules table
- add email/number input type and enter
 */
