import React from 'react';
import { Box, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/layout';
import Editor from '../components/Editor';
import parseAnsiString from '../utils/parseAnsiString';

const INITIAL_INPUT = `
const \u001b[0m\u001b[4m\u001b[42m\u001b[31ma = 1;
cons\u001b[39m\u001b[49m\u001b[24mt b = 2;

let bubbleSort = (inputArr) => {
  let len = \u001b[41minputArr\u001b[49m.length;
  for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
          if (inputArr[j] > \u001b[41minputArr\u001b[49m[j + 1]) {
              let tmp = \u001b[41minputArr\u001b[49m[j];
              inputArr[j] = inputArr[j + 1];
              inputArr[j + 1] = tmp;
          }
      }
  }
  return inputArr;
};
`

const Home = () => {
  const [input, setInput] = React.useState(INITIAL_INPUT);
  const [output, setOutput] = React.useState(parseAnsiString(INITIAL_INPUT));
  const { text, styles } = output;

  const handleOutputChange = React.useCallback((content) => {
    // Since code change, reset styles
    setOutput({
      text: content,
      styles: [],
    })
  }, []);
  
  React.useEffect(() => {
    // TODO: call API with body = output.text, to get new styles for patterns
  }, [output])

  React.useEffect(() => {
    // `input` will eventually come from backend
    setOutput(parseAnsiString(input))
  }, [input])

  return (
    <Flex height="100vh" flexDirection="column">
      <Text p={4} fontSize="4xl" fontWeight="bold">
        Pattern Highlighter
      </Text>
      <SimpleGrid columns={2} flex="1" border="1px" borderColor="gray.300">
        <VStack spacing={0}>
          <Box width="100%" py={2} textAlign="center" borderBottom="1px" borderColor="gray.300">
            Input (what the backend provides)
          </Box>
          <Box width="100%" flex="1">
            <Editor content={input} onChange={setInput} />
          </Box>
        </VStack>
        <VStack spacing={0}>
          <Box width="100%" py={2} textAlign="center" borderBottom="1px" borderColor="gray.300">
            Output (editor on the frontend)
          </Box>
          <Box width="100%" flex="1" borderLeft="1px" borderColor="gray.300">
            <Editor content={text} styles={styles} onChange={handleOutputChange} />
          </Box>
        </VStack>
      </SimpleGrid>
    </Flex>
  );
};

export default Home;