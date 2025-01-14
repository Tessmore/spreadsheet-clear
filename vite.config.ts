import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const BASE = "spreadsheet-clear";

// https://vitejs.dev/config/
export default defineConfig({
    base: `/${BASE}`,
    plugins: [react()],
    build: {
        sourcemap: true,
    },
});
