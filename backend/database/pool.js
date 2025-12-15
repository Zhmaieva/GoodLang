import {Pool, types} from 'pg';

// // Disable automatic parsing of `timestamp` and `timestamptz`
// const TIMESTAMPTZ_OID = 1184;
// const TIMESTAMP_OID = 1114;
//
// types.setTypeParser(TIMESTAMPTZ_OID, str => str); // return as-is string
// types.setTypeParser(TIMESTAMP_OID, str => str);

export const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: "good_lang",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
});
