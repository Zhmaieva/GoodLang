import dotenv from "dotenv";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

dotenv.config({
    path: [fileURLToPath(new URL("../.env", import.meta.url)), resolve(".env")],
    quiet: true,
});
