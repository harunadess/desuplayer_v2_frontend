import { hot } from 'react-hot-loader/root';
import React from 'react';
import { extendTheme, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import Main from './Main';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const theme = extendTheme({ config });

console.log('sizing', window.innerWidth, window.innerHeight);

function App() {
  return (
    <Box>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Main />
      </ChakraProvider>
    </Box>
  );
}

export default hot(App);