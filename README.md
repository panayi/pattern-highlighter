## Problem Statement

The system generates several patterns in the code that needs to be highlighted in the editor on the frontend side. The API provides a text, in which parts of the text that correspond to patterns are wrapped within ANSI color codes. The objective is to develop an editor (based on existing editor libs such as [Ace](https://ace.c9.io/)) that not only  highlights the code, but also highlights those patterns according to the provided ANSI color codes.

## Solution

1. The first thing I did was read on AceEditor and search on Stackoverflow/Github whether someone else had the same requirement and see how they tackle it. And in general, I'm looking to understand how to customize syntax-highlighting in AceEditor. Found their [guide here](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#extending-the-highlighter) which shows that highlighting is based on matching regular expressions and passing tokens (classnames) when there's a match.

2. I'm thinking that including ANSI codes in the text and then highlighting with regex has a drawback. What if the actual code contains ANSI color codes, and the editor mistakes them for patterns delimiters and highlights them (and hence removing actual code)? For example:

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

Therefore mixing content (code) with style can cause unexpected results and the API should provide a structure that separates styles from content. For example:

```
const data = {
  code: "code goes here",
  styles: [
    {
      startIndex: 3,
      endIndex: 10,
      bg: 'red',
    },
    {
      startIndex: 29,
      endIndex: 36,
      bg: 'red',
    },
    // ...etc
  ]
}
```

On the frontend we won't rely on regex for applying the patterns styles, but instead implement decorators that modify the output of the editor (AceEditor, Draft.js) to apply the pattern styles, before rendering according to the following pseudo-algorithm:

```
FOR i = 0 to LENGTH(text)
  CHAR = text[i]

  FOR j = 0 to LENGTH(data.styles)
    STYLE = data.styles[j]

    IF i >= STYLE.startIndex AND i < STYLE.endIndex
      CHAR = APPLY_STYLE(CHAR, STYLE.bg)
    END
  END
END
```

Where `APPLY_STYLE` is the method for transforming a character to apply a style. In the case of React we'll be wrapping the character with a component that applies the style. I think this approach is easier to implement and test, and less prone to bugs. Moreover it is easier to apply overlapping patterns (one or more characters are part of multiple patterns) — not sure how easy it is to achieve this with regex matching.

### Solution

Reading around and testing different methods, I'm going to go for the following solution:

- Use this syntax highlighter https://github.com/react-syntax-highlighter/react-syntax-highlighter which has the benefit in that it builds a proper React DOM tree and updates DOM as needed (instead of re-rendering like other solutions)
- Use this approach for rendering a textarea + the highlighed-syntax on top. User edits the text in the textarea but sees the highlighted syntax. This avoid the need for loading heavy editors such as AceEditor.
- Use a custom renderer for react-syntax-highlighter that modifies the output before rendering and inserts the pattern highlights.
