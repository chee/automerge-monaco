import {defineConfig} from "vite"
import wasm from "vite-plugin-wasm"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import dts from "vite-plugin-dts"

export default defineConfig({
	build: {
		sourcemap: true,
		lib: {
			entry: "./lib/automonaco.ts",
			name: "Automonaco",
			fileName: "automonaco",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["@automerge/automerge-repo/slim"],
		},
	},
	plugins: [wasm(), monacoEditorPlugin, dts()],
	worker: {
		format: "es",
	},
})
