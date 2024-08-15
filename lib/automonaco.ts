import type {editor} from "monaco-editor/esm/vs/editor/editor.api.d.ts"

import {
	splice,
	type Doc,
	type DocHandle,
	type DocHandleChangePayload,
	type Prop,
} from "@automerge/automerge-repo/slim"

export default function automonaco(
	editor: editor.IStandaloneCodeEditor,
	handle: DocHandle<unknown>,
	path: Prop[]
) {
	let model = editor.getModel()!
	let sending = false
	let receiving = false

	function onLocalChange(event: editor.IModelContentChangedEvent) {
		if (!event.changes.length) return
		if (receiving) return
		sending = true
		handle.change(doc => {
			for (let change of event.changes) {
				let {rangeOffset, rangeLength, text} = change
				if (!rangeOffset && !rangeLength) continue
				splice(doc as Doc<unknown>, path, rangeOffset, rangeLength, text)
			}
		})
		sending = false
	}

	function onRemoteChange(payload: DocHandleChangePayload<unknown>) {
		if (sending) {
			return
		}
		receiving = true
		model.pushEditOperations(
			editor.getSelections(),
			payload.patches.map(patch => {
				if (!["del", "splice"].includes(patch.action)) {
					throw new Error(
						"Unexpected action for text editor: " + patch.action
					)
				}
				let startOffset = patch.path[patch.path.length - 1] as number
				let endOffset =
					patch.action == "del"
						? startOffset + (patch.length ?? 1)
						: startOffset

				let startPosition = model.getPositionAt(startOffset)!
				let endPosition = model.getPositionAt(endOffset)!
				return {
					range: {
						startColumn: startPosition?.column,
						startLineNumber: startPosition?.lineNumber,
						endColumn: endPosition?.column,
						endLineNumber: endPosition?.lineNumber,
					},
					text: patch.action == "splice" ? patch.value : "",
				}
			}),
			// it seems to be ok to pass undefined here
			undefined as unknown as editor.ICursorStateComputer
		)
		receiving = false
	}

	let localChangeHandler = model.onDidChangeContent(onLocalChange)
	handle.on("change", onRemoteChange)

	return () => {
		localChangeHandler.dispose()
		handle.off("change", onRemoteChange)
	}
}
