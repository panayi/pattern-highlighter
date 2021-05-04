## Getting started

`yarn start`: Start local development server

`yarn test`: Run tests

Deployed on Vercel: https://pattern-highlighter.vercel.app/

## Problem

The system generates several patterns in the code that needs to be highlighted in the editor on the frontend side. The API provides a text, in which parts of the text that correspond to patterns are wrapped within ANSI color codes. The objective is to develop an editor (based on existing editor libs such as [Ace](https://ace.c9.io/)) that not only highlights the code, but also highlights the patterns, according to the provided ANSI color codes.

## Explore potential solutions

1. One way is to use regular experssion matching with the ACE editor ([see here](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#extending-the-highlighter)). However, this approach might interfere with default styles applied by ACEditor for the current language (I haven't tried it). Moreover, it can be hard to account for cases where the actual code contains ANSI codes. For example:

```
// The following is actual code and should not be highlighted:

const a = "\u001b[31mHello world\u001b[0m"

// The following is a pattern:

const b = (arr) => {
  return arr.map(item => {
    return item.reduce((acc, n) => \u001b[31macc + n\u001b[0m, 0);
  });
}
```

In order to avoid such cases, it is best that the API provides the code and styles separately, such as the following (A):

```
const data = {
  code: "const a = 1; // etc.",
  styles: [
    {
      startIndex: 3,
      endIndex: 10,
      style: {
        backgroundColor: 'red',
      }
    },
    {
      startIndex: 29,
      endIndex: 36,
      style: {
        backgroundColor: 'red',
      }
    },
    // ...etc
  ]
}
```


2. A different approach is to let the editor highlight the raw code (without the ANSI codes) and before rendering, alter the output to insert the background-colors as specified by the patterns. This approach decouples code highlighting from patterns highlighting, and makes it easier to switch to the implementation suggested in (A) above. It's also easier to test and implement.

## Overview of the implementation

1. Code-editor is based on https://github.com/satya164/react-simple-code-editor
2. Code highlighting is based on https://github.com/FormidableLabs/prism-react-renderer
3. The `input` to the app is a string with ANSI codes wrapping code that should be styled (any ANSI style is supported).
4. Using https://github.com/xpl/ansicolor, to parse the `input` string and get the raw code + a list of styles (see `data` (A) above).
5. The output of `prism-react-renderer` is modified to render the styles of the patterns.
6. If in the future, the API is modified to return an object such as (A), we'll just need to remove step (4).

## UI

1. Edit the lefthand side editor to change the input (change code or patterns), which updates the right-hand side editor to render highlighted code and patterns.
2. When you make a change to the righthand side editor, all pattern styles are removed, since patterns may no longer be valid. Once this code is connected to the API, at that point it will make a call to get the new patterns. 