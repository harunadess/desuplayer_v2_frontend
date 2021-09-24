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

// (maybe object of arrays with a key for each, and we know what tab we're on.. or something)

// search
// playlist
// context menu
const MainPanel = () => {
  // api
  const [server, setServer] = useState(constants.serverOrigin);

  // library 
  const [library, setLibrary] = useState([]);
  const [musicDir, setMusicDir] = useState('D:/Users/Jorta/Music');
  const [selected, setSelected] = useState({});
  const [contextMenu, setContextMenu] = useState(contextMenuOptions);
  const [playlist, setPlaylist] = useState([
    {
      "Title": "Red fraction (Game Version)",
      "Artist": "Afterglow",
      "Discnumber": 0,
      "Tracknumber": 1,
      "Filetype": "MP3",
      "Path": "D:\\Users\\Jorta\\Music\\Bandori\\Red_fraction_Game_Version_.mp3"
    },
    {
      "Title": "Scarlet Sky (Game Version)",
      "Artist": "Afterglow",
      "Discnumber": 0,
      "Tracknumber": 1,
      "Filetype": "MP3",
      "Path": "D:\\Users\\Jorta\\Music\\Bandori\\Scarlet_Sky_Game_Version_.mp3"
    }
  ]);

  // display
  const [isLoading, setIsLoading] = useState(true);

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
  };

  // todo: remove or rethink this
  const onClickSong = (item) => {
    console.log('clicked song =>', item);
    setSelected(item);

    requests.get('music/getSong', { path: item.Path }, 'blob')
      .then(res => {
        const format = res.headers['content-type'];
        const track = new Blob([res.data], { type: format });
        const trackURL = window.URL.createObjectURL(track);
        setAudioSrc(trackURL);
      }).catch(console.error);
  };

  const onChangeApi = (value) => {
    setServer(value);
    requests.setApi(value);
  };

  // todo: other playery things
  const onPlay = (items) => {
    if(Array.isArray(items))
      setPlaylist(items);
    else
      setPlaylist([items]);
  };

  // todo: other playery things
  const onPlayNext = (items) => {
    if(Array.isArray(items))
      setPlaylist((playlist) => [].concat(...items, ...playlist));
    else
      setPlaylist((playlist) => [].concat(items, ...playlist));
  };

  // todo: other playery things
  const onAddToQueue = (items) => {
    if(Array.isArray(items))
     setPlaylist((playlist) => [].concat(...playlist, ...items));
    else
      setPlaylist((playlist) => [].concat(...playlist, items));
  };

  // todo: loading skeleton
  // todo: change album menu to only open on single click (separate state, not just check if selected album)
  return (
    <Box>
      <LibraryConfig buildLibrary={buildLibrary} getAlbums={musicApi.getAllArtists} onChangeApi={onChangeApi} musicDir={musicDir} setMusicDir={setMusicDir} server={server} />
      {isLoading &&
        <Box>
          <Center>
            <Text align='center'>
              Loading...
            </Text>
          </Center>
        </Box>
      }
      {!isLoading && library.length === 0 &&
        <Box>
          <Center>
            <Text align='center'>
              Library failed to load, or is empty.<br />
              Check server is running at http://{server} and that your music root is correct.
            </Text>
          </Center>
        </Box>
      }
      {!isLoading && library.length > 0 &&
        <VStack align='stretch' divider={<StackDivider borderColor='gray.200' />} spacing='4' w='100vw' h='90vh' padding='4' overflow='hidden'>
          <ItemList items={library} onClickItem={onClickAlbum} contextMenuOptions={contextMenu} setSelected={setSelected} />
          <Player playlist={playlist} setPlaylist={setPlaylist} />
        </VStack>
      }
      <AlbumDrawer selectedAlbum={selected} setSelectedAlbum={setSelected} contextMenuOptions={contextMenu} />
    </Box>
  );
};

export default MainPanel;