import { defineConfig } from "tsup";

export default defineConfig(() => ({
    target: "ES6",
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: false,
    entryPoints: ["src/zustand-create-slices.ts"]
}));
