# Automerge + Monaco

This plugin adds collaborative editing to
[monaco-editor](https://github.com/microsoft/monaco-editor) using
[`automerge`](https://automerge.org/).

## Example

```ts
import {Repo} from "@automerge/automerge-repo"
import automonaco from "automerge-monaco"
import {EditorView} from "@codemirror/view"
import {basicSetup} from "codemirror"

// set up a repo and create a doc handle.
// see https://automerge.org/docs/quickstart/
let repo = new Repo(..)
let doc = repo.create({code: ""})

// set up monaco
let monaco = await loader.init()
let container = document.getElementById("editor")!
let editor = monaco.editor.create(container, {
	value: handle.docSync()?.code,
	language: "javascript",
	automaticLayout: true,
})

automonaco(editor, handle, ["code"])
```

