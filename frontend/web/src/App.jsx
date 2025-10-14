import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";

export default function App() {
    // Theme lives here and is passed down
    const theme = {
        bg: "#fff3df",
        accent: "#ff6138",
        accentDark: "#d74e2a",
        green: "#4ba36e",
        greenDark: "#2d6f48",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "#a47856",
        radius: 20,
    };

    return (
        <Routes>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
        </Routes>
    );
}
