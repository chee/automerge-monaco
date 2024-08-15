import {defineConfig} from "vite"
import wasm from "vite-plugin-wasm"
import monacoEditorPlugin from "vite-plugin-monaco-editor"

export default defineConfig({
	build: {
		lib: {
			entry: "./lib/automonaco.ts",
			name: "Automonaco",
			fileName: "automonaco",
		},
	},
	plugins: [wasm(), monacoEditorPlugin],
	worker: {
		format: "es",
	},
})
