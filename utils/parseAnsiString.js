import ansicolor from 'ansicolor';
import getStyleObjectFromString from './getStyleObjectFromString';

// Parses a string that contain ANSI styles
// Returns the raw `text` and a list of `styles` applied, of the format:
// { startIndex, endIndex, style }
const parseAnsiString = (str) => {
  const parsed = ansicolor.parse(str);
  let count = 0;

  return parsed.spans.reduce((acc, item) => {
    const text = acc.text + item.text;
    const styles = acc.styles;

    if (item.css) {
      styles.push({
        startIndex: count,
        endIndex: count + item.text.length,
        style: getStyleObjectFromString(item.css),
      })
    }

    count += item.text.length;

    return {
      text,
      styles,
    }
  }, { text: '', styles: [] })
}

export default parseAnsiString;
