import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
    target: "ES6",
    format: ["esm"],
    clean: !options.watch,
    sourcemap: !!options.watch,
    minify: options.watch ? false : "terser",
    terserOptions: {
        mangle: {
            toplevel: true,
        },
        compress: {
            
        }
    },
    entryPoints: ["src/createSlices.ts"]
}));
