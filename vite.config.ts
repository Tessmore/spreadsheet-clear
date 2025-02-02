import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const BASE = "spreadsheet-clear";

export default defineConfig({
    base: `/${BASE}`,
    plugins: [react()],
    build: {
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
    },
});
