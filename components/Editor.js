import React from "react";
import SimpleCodeEditor from 'react-simple-code-editor'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'

const editorStyles = {
  height: '100%',
  fontFamily: '"Dank Mono", "Fira Code", monospace',
  ...theme.plain
}

const CharacterRenderer = (props) => {
  const { char, index, offset, styles } = props;

  const activeStyles = React.useMemo(() => {
    const globalIndex = offset + props.index;

    return styles.filter(({ startIndex, endIndex }) => (
      globalIndex >= startIndex && globalIndex < endIndex
    ))
  }, [index, offset, styles])

  return activeStyles.reduce((acc, item) => (
    <span style={item.style}>
      {acc}
    </span>
  ), [char])
}

const TokenRenderer = (props) => {
  const { styles, offset, children, ...rest } = props;

  return (
    <span {...rest}>
      {children.split('').map((char, index) => (
        <CharacterRenderer key={index} index={index} offset={offset} char={char} styles={styles} />
      ))}
    </span>
  )
}

const HighlightCode = ({ code, styles }) => {
  let offset = 0;

  return (
    <Highlight {...defaultProps} theme={theme} code={code} language="json">
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => {
            const lineOutput = (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => {
                  const tokenProps = getTokenProps({ token, key });

                  const tokenOutput = (
                    <TokenRenderer {...tokenProps} offset={offset} styles={styles} />
                  );
                  
                  if (!token.empty) {
                    offset += tokenProps.children.length;
                  }

                  return tokenOutput;
                })}
              </div>
            );
            
            // new-line character
            offset += 1;

            return lineOutput;
          })}
        </>
      )}
    </Highlight>
  );
}

const noop = () => null;

const Editor = ({ content = '', styles = [], onChange = noop }) => {
  return (
    <SimpleCodeEditor
      value={content}
      onValueChange={onChange}
      highlight={code => <HighlightCode code={code} styles={styles} />}
      padding={10}
      style={editorStyles}
    />
  )
};

export default Editor;