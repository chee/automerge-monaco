# Automerge + Monaco

This plugin adds collaborative editing to
[monaco-editor](https://github.com/microsoft/monaco-editor) using
[`automerge`](https://automerge.org/).

> [!note]
> this is alpha software

## Example

```ts
import {Repo} from "@automerge/automerge-repo"
import automonaco from "automerge-monaco"

// set up a repo and create a doc handle.
// see https://automerge.org/docs/quickstart/
let repo = new Repo(..)
let doc = repo.create({code: ""})

// set up monaco
let monaco = await loader.init()
let container = document.getElementById("editor")!
// from "monaco-editor" or "@monaco-editor/loader" etc
let editor = monaco.editor.create(container, {
	value: handle.doc()?.code,
	language: "javascript",
	automaticLayout: true,
})

automonaco(editor, handle, ["code"])
```
