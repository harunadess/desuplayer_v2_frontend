import React, { useState, useEffect } from 'react';
import { StackDivider, VStack, Box } from '@chakra-ui/layout';
import { Center, Text } from '@chakra-ui/react';
import * as requests from '../../helpers/request';
import { default as libraryApi } from '../../api/library';
import { default as musicApi } from '../../api/music';
import Player from '../Player';
import ItemList from '../ItemList';
import { constants, contextMenuOptions } from '../../constants';
import LibraryConfig from '../LibraryConfig';
import AlbumDrawer from '../AlbumDrawer';
import Loader from '../Loader';

// search

// playlist

// context menu (needs tweaking, but sort of done)
// fixing song meta data / adding meta data
const MainPanel = () => {
  // api
  const [server, setServer] = useState(constants.serverOrigin);

  // library 
  const [library, setLibrary] = useState([]);
  const [musicDir, setMusicDir] = useState('D:/Users/Jorta/Music');
  const [selected, setSelected] = useState({});
  const [contextMenu, setContextMenu] = useState(contextMenuOptions);
  const [playlist, setPlaylist] = useState([]);

  // display
  const [isLoading, setIsLoading] = useState(true);
  const [isAlbumDrawerOpen, setAlbumDrawerOpen] = useState(false);

  useEffect(() => {
    requests.setApi(server);
    musicApi.getAllArtists().then(data => {
      setLibrary(data);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      setIsLoading(false);
    });

    setContextMenu((contextMenu) => {
      return {
        play: { ...contextMenu.play, action: onPlay },
        playNext: { ...contextMenu.playNext, action: onPlayNext },
        addToQueue: { ...contextMenu.addToQueue, action: onAddToQueue }
      }
    });
  }, []);

  const buildLibrary = () => {
    setIsLoading(true);
    libraryApi.build(musicDir)
      .then(data => {
        setLibrary(data);
      }).catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onClickAlbum = (item) => {
    console.log('clicked album ->', item);
    setSelected(item);
    setAlbumDrawerOpen(true);
  };

  const onChangeApi = (value) => {
    setServer(value);
    requests.setApi(value);
  };

  const onPlay = (item) => {
    // is a playlist or artist, therefore we don't want to hide the album drawer
    if(item.Songs) {
      const songs = Object.values(item.Songs);
      setPlaylist(songs);
    } else {
      setPlaylist([item]);
    }
    setSelected({});
    setAlbumDrawerOpen(false);
  };

  const onPlayNext = (item) => {
    if(item.Songs) {
      const songs = Object.values(item.Songs);
      setPlaylist((playlist) => [].concat(...songs, ...playlist));
    } else {
      setPlaylist((playlist) => [].concat(item, ...playlist));
    }
  };

  const onAddToQueue = (item) => {
    if(item.Songs) {
      const songs = Object.values(item.Songs);
      setPlaylist((playlist) => [].concat(...playlist, ...songs));
    } else {
      setPlaylist((playlist) => [].concat(...playlist, item));
    }
  };

  const onAlbumDrawerClose = () => {
    setSelected({});
    setAlbumDrawerOpen(false);
  };

  // todo: loading skeleton
  // todo: change album menu to only open on single click (separate state, not just check if selected album)
  return (
    <Box>
      <LibraryConfig buildLibrary={buildLibrary} getAlbums={musicApi.getAllArtists} onChangeApi={onChangeApi} musicDir={musicDir} setMusicDir={setMusicDir} server={server} />
      {isLoading &&
        <Loader spinner />
      }
      {!isLoading && library.length === 0 &&
        <Box w='100vw' h='90wh'>
          <Center w='100vw' h='90wh'>
            <Text align='center' marginTop='15%'>
              Library failed to load, or is empty.<br />
              Check server is running at http://{server} and that your music root is correct.
            </Text>
          </Center>
        </Box>
      }
      {!isLoading && library.length > 0 &&
        <VStack align='stretch' divider={<StackDivider borderColor='gray.200' />} spacing='4' w='100vw' h='90vh' padding='4' overflow='hidden'>
          <ItemList items={library} onClickItem={onClickAlbum} contextMenuOptions={contextMenu} selected={selected} setSelected={setSelected} />
          <Player playlist={playlist} setPlaylist={setPlaylist} />
        </VStack>
      }
      <AlbumDrawer isOpen={isAlbumDrawerOpen} selectedAlbum={selected} onClose={onAlbumDrawerClose} contextMenuOptions={contextMenu} setSelected={setSelected} />
    </Box>
  );
};

export default MainPanel;