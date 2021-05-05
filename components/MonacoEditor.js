import React from 'react';
import Editor from "@monaco-editor/react";

const DEFAULT_VALUE = `var increment = function (i) {
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

class MonacoEditor extends React.Component {
  render() {
    return (
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        defaultValue={DEFAULT_VALUE}
      />
    );
  }
}

export default MonacoEditor