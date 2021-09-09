import React, { useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter,
  SimpleGrid, Box, Text
} from '@chakra-ui/react';
import ContextMenu from '../ContextMenu';

const gridWidths = {
  trackNum: '10%',
  title: '30%',
  artist: '30%',
  format: '30%'
};

const AlbumDrawer = (props) => {
  const {
    selectedAlbum,
    setSelectedAlbum,
    contextMenuOptions
  } = props;
  const [songs, setSongs] = useState([]);
  

  useEffect(() => {
    if(!selectedAlbum) return;

    setSongs(() => {
      return Object.keys(selectedAlbum.Songs || {})
              .map(k => ({...selectedAlbum.Songs[k], Artist: selectedAlbum.Artist}))
              .sort((a, b) => a.Tracknumber > b.Tracknumber ? 1 : -1);
    });
  }, [selectedAlbum]);

  return (
    <Drawer isOpen={selectedAlbum?.Title !== undefined} placement='right' onClose={() => setSelectedAlbum({})} size='md'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{selectedAlbum?.Title || 'No Title available'}</DrawerHeader>
        <DrawerBody>
          <SimpleGrid columns={4} spacing={2} w='100%'>
            <Box><Text size='md'>#</Text></Box>
            <Box><Text size='md'>Title</Text></Box>
            <Box><Text size='md'>Atrist</Text></Box>
            <Box><Text size='md'>Format</Text></Box>
          </SimpleGrid>
            {songs.map(song => {
              return (
                <ContextMenu elementType={SimpleGrid} options={contextMenuOptions} itemData={song}>
                  <SimpleGrid columns={4} spacing={2} w='100%' marginTop={2} marginBottom={2}>
                    <Box><Text size='md'>{song.Tracknumber}</Text></Box>
                    <Box><Text size='md'>{song.Title}</Text></Box>
                    <Box><Text size='md'>{song.Artist}</Text></Box>
                    <Box><Text size='md'>{song.Filetype}</Text></Box>
                  </SimpleGrid>
                </ContextMenu>
              );
            })}
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default AlbumDrawer;