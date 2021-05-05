import React, { useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";

const ORIGINAL = `var increment = function (i) {
  return i + 1;
};

var remember = function (me) {
  this.you = me;
};

var sumToValue = function (x, y) {
  function Value(v) { this.value = v; }
  return new Value(x + y);
};

var times = (x, y) => {
  return x * y;
}
`

const MODIFIED = `var increment = i => {
  return i + 1;
};

var remember = function (me) {
  this.you = me;
};

var sumToValue = (x, y) => {
  function Value(v) { this.value = v; }
  return new Value(x + y);
};

var times = (x, y) => x * y
`

function MonacoDiffEditor() {
  const diffEditorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    diffEditorRef.current = editor;
  }

  return (
    <>
      <DiffEditor
        height="100vh"
        defaultLanguage="javascript"
        original={ORIGINAL}
        modified={MODIFIED}
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default MonacoDiffEditor;