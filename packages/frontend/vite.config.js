import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, "./src"),
    build: {
        outDir: resolve(__dirname, "../../dist/frontend"),
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString();
                    }
                    return "";
                },
            },
        },
    },
    resolve: {
        alias: [
            { find: "@", replacement: resolve(__dirname, "./src") },
            { find: "@settings", replacement: resolve(__dirname, "./settings") },
            { find: "@test-utils", replacement: resolve(__dirname, "./test-utils") },
        ],
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tests.config.ts"],
        coverage: {
            include: ["**/src/**"],
            exclude: ["**/*.config.*/**", "**/zod.ts"],
        },
    },
});
