// Secret key for JWT from system environment variables
export const SECRET_KEY = process.env.GOODLANG_APP_SECRET;
export const MAIL_PASS = process.env.GOODLANG_MAIL_PASS;

export const EVENT_NAMES = {
    // POLL_INDEX_UPDATE: 'poll_index_update',
    // USER_CATEGORY_UPDATE: 'user_category_update',
}

export const ACTION_TYPES = {
    TRANSLATION_CALL: 100,
    UPDATE_ACCOUNT_STATUS_TO_PAID: 1,
    UPDATE_ACCOUNT_STATUS_TO_FREE: 2,
    UPDATE_ACCOUNT_STATUS_TO_ATTENTION: 3,
    // other action types...
};