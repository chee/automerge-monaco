import automonaco from "../lib/automonaco.ts"
import loader from "@monaco-editor/loader"
import {Repo, isValidAutomergeUrl} from "@automerge/automerge-repo"
import {BroadcastChannelNetworkAdapter} from "@automerge/automerge-repo-network-broadcastchannel"
import {BrowserWebSocketClientAdapter} from "@automerge/automerge-repo-network-websocket"
import {IndexedDBStorageAdapter} from "@automerge/automerge-repo-storage-indexeddb"

const repo = new Repo({
	network: [
		new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
		new BroadcastChannelNetworkAdapter(),
	],
	storage: new IndexedDBStorageAdapter(),
})

const rootDocUrl = document.location.hash.substring(1)

let handle
if (isValidAutomergeUrl(rootDocUrl)) {
	handle = repo.find<{code: string}>(rootDocUrl)
} else {
	handle = repo.create<{code: string}>({
		code: "(function hello() {})()",
	})
}

document.location.hash = handle.url

let monaco = await loader.init()
let editor = monaco.editor.create(document.getElementById("app")!, {
	value: handle.docSync()?.code,
	language: "typescript",
	automaticLayout: true,
})
automonaco(editor, handle, ["code"])
