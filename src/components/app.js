import { hot } from 'react-hot-loader/root';
import React from 'react';
import { extendTheme, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Main from './Main';

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false
};

const theme = extendTheme({ config });

function App() {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <ChakraProvider theme={theme}>
                <Main/>
            </ChakraProvider>
        </>
    );
}

export default hot(App);