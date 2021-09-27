import React, { useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter, SimpleGrid, Text } from '@chakra-ui/react';
import ContextMenu from '../ContextMenu';
import { playlistContextMenuId } from '../../constants';

const gridWidths = {
  trackNum: '10%',
  title: '30%',
  artist: '30%',
  format: '30%'
};

const AlbumDrawer = (props) => {
  const {
    isOpen,
    contextMenuOptions,
    selectedAlbum,
    onClose,
    setSelected
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

  // todo: potentially change out SimpleGrid/Text for something better
  // so you can adjust column widths
  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='md'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{selectedAlbum?.Title || 'No Title available'}</DrawerHeader>
        <DrawerBody>
          <SimpleGrid columns={4} spacing={1} w='100%'>
            <Text size='md'>No.</Text>
            <Text size='md'>Title</Text>
            <Text size='md'>Atrist</Text>
            <Text size='md'>Format</Text>
          </SimpleGrid>
            {songs.map(song => {
              return (
                <ContextMenu key={`ctx_menu_${song.Path}`} id={`${playlistContextMenuId}_${song.Path}`} options={contextMenuOptions} selected={song} setSelected={setSelected}>
                  <SimpleGrid columns={4} spacing={1} w='100%' marginTop={2} marginBottom={2}>
                    <Text cursor='pointer' size='md'>{song.Tracknumber}</Text>
                    <Text cursor='pointer' size='md'>{song.Title}</Text>
                    <Text cursor='pointer' size='md'>{song.Artist}</Text>
                    <Text cursor='pointer' size='md'>{song.Filetype}</Text>
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