import React, { useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption
} from '@chakra-ui/react';
import { VStack, StackDivider, Box, Text } from '@chakra-ui/layout';

const AlbumDrawer = (props) => {
  const {
    selectedAlbum,
    setSelectedAlbum,
    onClickSong
  } = props;
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if(!selectedAlbum) return;

    setSongs(() => {
      return Object.keys(selectedAlbum.Songs || {})
              .map(k => selectedAlbum.Songs[k])
              .sort((a, b) => a.Tracknumber < b.Tracknumber);
    });
  }, [selectedAlbum]);
  
  return (
    <Drawer isOpen={selectedAlbum?.Title !== undefined} placement='right' onClose={() => setSelectedAlbum({})} size='md'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{selectedAlbum?.Title || 'No Title available'}</DrawerHeader>
        <DrawerBody>
          <VStack divider={<StackDivider borderColor='gray.200' />}>
            <Table>
              <Thead>
                <Tr>
                  <Td>#</Td>
                  <Td>Title</Td>
                  <Td>Artist</Td>
                  <Td>Format</Td>
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(selectedAlbum?.Songs || {}).map(key => {
                  const song = selectedAlbum?.Songs[key];
                  return (
                    <Tr key={key}>
                      <Td>{song.Tracknumber}</Td>
                      <Td>{song.Title}</Td>
                      <Td>{selectedAlbum.Artist}</Td>
                      <Td>{song.Filetype || 'Not available'}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </VStack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default AlbumDrawer;