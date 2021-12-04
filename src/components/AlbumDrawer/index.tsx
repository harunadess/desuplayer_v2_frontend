import { FC, useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter, SimpleGrid, Text } from '@chakra-ui/react';
import ContextMenu from '../ContextMenu';
import { ContextMenuOptions, playlistContextMenuId } from '../../constants';
import { Album, Playable, Song } from '../../types/data/library';

interface Props {
  contextMenuOptions: ContextMenuOptions;
  isOpen: boolean;
  selectedAlbum: Album | {};
  setSelected: (item: Playable) => void;
  onClose: () => void;
}

const albumSelected = (item: Album | {}): item is Album => (item as Album).Songs !== undefined;

const AlbumDrawer: FC<Props> = (props) => {
  const { contextMenuOptions, isOpen, selectedAlbum, onClose } = props;

  const [songs, setSongs] = useState<Song[]>([]);
  
  useEffect(() => {
    if(albumSelected(selectedAlbum)) {
      const sortedSongs = Object.keys(selectedAlbum.Songs)
      .map(k => selectedAlbum.Songs[k])
      .sort((a, b) => a.Tracknumber > b.Tracknumber ? 1 : -1);
      setSongs(sortedSongs);
    }
  }, [selectedAlbum]);
  
  if(!albumSelected(selectedAlbum))
    return null;

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
            <Text size='md'>Artist</Text>
            <Text size='md'>Format</Text>
          </SimpleGrid>
            {songs.map(song => {
              return (
                <ContextMenu key={`ctx_menu_${song.Path}`} id={`${playlistContextMenuId}_${song.Path}`} options={contextMenuOptions} selected={song}>
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