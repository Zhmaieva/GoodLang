import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { installGlobalFont } from "../../../shared/fontFamily.js";
import { installGlobalTheme } from "./theme.js";

installGlobalTheme();
installGlobalFont();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
