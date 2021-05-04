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
        style: getStyleFromCss(item.css),
      })
    }

    count += item.text.length;

    return {
      text,
      styles,
    }
  }, { text: '', styles: [] })
}

const getStyleFromCss = (css) => {
  const style = getStyleObjectFromString(css);

  let background = null;

  if (style.background) {
    // Add some opacity so that cursor is visible
    // TODO: should check if background is in rgb format (use npm polished if needed)
    const rgb = style.background.match(/\d+/g)
    background = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`
  }

  return {
    ...style,
    background,
  }
}

export default parseAnsiString;
