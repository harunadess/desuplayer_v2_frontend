import { FC, useEffect } from 'react';
import { extendTheme, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import Main from './components/Main';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const theme = extendTheme({ config });

const preventContextMenu = (event: Event) => {
  event.preventDefault();
};

const App: FC = () => {

  useEffect(() => {
    document.addEventListener('contextmenu', preventContextMenu);
    return (() => {
      document.removeEventListener('contextmenu', preventContextMenu);
    });
  }, []);

  return (
    <Box>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Main />
      </ChakraProvider>
    </Box>
  );
};

export default App;
