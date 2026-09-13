import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "./",
    plugins: [
        react(),
        {
            name: "goodlang-native-viewport",
            transformIndexHtml(html) {
                return html.replace(
                    "width=device-width, initial-scale=1.0",
                    "width=device-width, initial-scale=1.0, viewport-fit=cover",
                );
            },
        },
    ],
    build: {
        // The native wrapper embeds one HTML payload. Keeping all JavaScript in
        // one chunk lets its bundling script inline every local dependency.
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
});
