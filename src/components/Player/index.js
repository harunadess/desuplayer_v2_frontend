import React, { useEffect, useState, useRef } from 'react';
import propTypes from 'prop-types';

import { IconButton } from '@chakra-ui/button';
import { Box, HStack, SimpleGrid } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { MdFeaturedPlayList, MdGraphicEq, MdList, MdPause, MdPauseCircleOutline, MdPlayArrow, MdPlayCircleOutline, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import { Grid, GridItem } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { ButtonGroup } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';

import { default as musicApi } from '../../api/music';
import { playerStates } from '../../constants';

const maxHeight = 100;
const layoutSizes = {
  mainControls: { h: maxHeight, w: 100 },
  albumAndDeets: { h: maxHeight, w: 100 },
  auxControls: { h: maxHeight, w: 500 }
};

const Player = (props) => {
  const { playlist, setPlaylist } = props;

  const audioRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    currentSong: undefined,
    index: 0,
    source: '',
    state: playerStates.end,
    previousState: playerStates.end,
    volume: 0.20
  });

  const play = () => {
    console.log('play');
    if(playerState.source) {
      console.log('already exists, resume');
      audioRef.current.play();
      return;
    }

    const next = playlist[playerState.index];
    if(!next) {
      console.log('no song in playlist, return');
      setPlayerState({
        ...playerState,
        currentSong: undefined,
        index: 0,
        source: '',
        state: playerStates.end
      });
      return;
    }

    let current = { ...next };
    musicApi.getSongMeta(current.Path, current.AlbumArtist || current.Artist, current.AlbumTitle).then((songMeta) => {
      current = songMeta;
    }).finally(() => {
      musicApi.getSong(current.Path).then((songData) => {
        setPlayerState({
          ...playerState,
          currentSong: current,
          source: window.URL.createObjectURL(songData),
        });
        audioRef.current.volume = playerState.volume;
        audioRef.current.load();
        audioRef.current.play();
      });
    });
  };

  const pause = () => {
    console.log('pause');
    audioRef.current.pause();
  };

  const sk_bk = () => {
    console.log('sk_bk');
    const prev = playlist[playerState.index - 1];
    if(!prev) {
      console.log('no prev song');
      setPlayerState({
        ...playerState,
        state: playerState.source ? playerStates.play : playerStates.end
      });
      return;
    }

    audioRef?.current?.pause();

    setPlayerState({
      ...playerState,
      source: '',
      index: playerState.index - 1,
      state: playerStates.play,
    });
  };

  const sk_fwd = () => {
    console.log('sk_fwd');
    const next = playlist[playerState.index + 1];
    if(!next) {
      console.log('no next song');
      setPlayerState({
        ...playerState,
        state: playerState.source ? playerStates.play : playerStates.end
      });
      return;
    }

    audioRef?.current?.pause();

    setPlayerState({
      ...playerState,
      source: '',
      index: playerState.index + 1,
      state: playerStates.play
    });
  };

  const end = () => {
    console.log('end');
    if(playerState.source) {
      setPlayerState({
        ...playerState,
        source: '',
        index: playerState.index + 1,
        state: playerStates.play
      });
    }
  };

  const onChangeVolume = (value) => {
    if(audioRef?.current.volume) {
      audioRef.current.volume = (value*0.01);
    }
    setPlayerState({
      ...playerState,
      volume: (value*0.01)
    });
  };

  const oldUI = () => {
    return (
      <Box>
        {playerState.source &&
          <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={end} />
        }
        <Grid
          gap={2}
          templateColumns={'repeat(12, 1fr)'}
        >
          <GridItem colSpan={1}>
            <ButtonGroup size={'sm'}>
              <IconButton
                icon={<MdSkipPrevious />}
                onClick={() => console.log('previous')}
              />
              <IconButton
                icon={playerState.isPlaying ? <MdPause /> : <MdPlayArrow />}
                onClick={pause}
              />
              <IconButton
                icon={<MdSkipNext />}
                onClick={() => console.log('next')}
              />
            </ButtonGroup>
          </GridItem>
          <GridItem colSpan={2}>
            <Center height={'100%'} width={'100%'}>
              <Slider
                min={0}
                max={100}
                onChange={onChangeVolume}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
              </Slider>
            </Center>
          </GridItem>
          <GridItem colSpan={6}>
            {playerState.currentlyPlaying?.Path &&
              <Box>
                <Text fontSize={'small'} >
                  {playerState.currentlyPlaying.Title} - {playerState.currentlyPlaying.Artist ? `${playerState.currentlyPlaying.Artist}` : 'Unknown Artist'}{playerState.currentlyPlaying.Album ? ` (${playerState.currentlyPlaying.Album})` : ''}
                </Text>
              </Box>
            }
          </GridItem>
        </Grid>
      </Box>
    );
  };

  useEffect(() => {
    console.log('updated player state:', playerState);

    if(playerState.state === playerStates.end)
      end();
    if(playerState.state === playerStates.play)
      play();
    if(playerState.state === playerStates.pause)
      pause();
    if(playerState.state === playerStates.sk_bk)
      sk_bk();
    if(playerState.state === playerStates.sk_fwd)
      sk_fwd();
  }, [playerState.state]);

  useEffect(() => {
    console.log('playlist updated', playlist);
  }, [playlist]);

  return (
    // todo: this might be a job for regular Grid after all, but instead you figure out how to use it
    <SimpleGrid columns={3} height='15%'>
      {playerState.source &&
        <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={() => setPlayerState({ ...playerState, state: playerStates.end }) } />
      }
      {/* album box and details & main controls */}
      <Box>
        <HStack spacing='4'>
          <Box key={`Player_${playerState.currentSong?.Title}_${playerState.currentSong?.Artist}`}>
            {(playerState.currentSong?.Picturetype && playerState.currentSong?.Picturedata) &&
              <Image margin='auto' h={maxHeight} src={`data:image/${playerState.currentSong?.Picturetype};base64,${playerState.currentSong?.Picturedata}`} />
            }
            {(!playerState.currentSong?.Picturetype || !playerState.currentSong?.Picturedata) &&
              <Box margin='auto' width={maxHeight} h={maxHeight} backgroundColor='gray.200' >
                <Text paddingTop='25%' align='center' fontWeight='bold'>No image available</Text>
              </Box>
            }
          </Box>
          <Box w='35%'>
            <Text fontSize='sm' textAlign='left' textOverflow='ellipsis' overflow='hidden'>
              {playerState.currentSong?.Title || 'No Title available'}
            </Text>
            <Text fontSize='sm' textAlign='left' textOverflow='ellipsis' overflow='hidden'>
              {playerState.currentSong?.Artist || 'No Artist available'}
            </Text>
          </Box>
          <Box>
            <ButtonGroup size='lg'>
              <IconButton
                background='transparent'
                icon={<MdSkipPrevious  />}
                onClick={() => setPlayerState({ ...playerState, state: playerStates.sk_bk })}
              />
              <IconButton
                background='transparent'
                icon={(playerState.state === playerStates.play) ? <MdPauseCircleOutline /> : <MdPlayCircleOutline />}
                onClick={() => {
                  const state = playerState.state;
                  const newState = state === playerStates.play ? playerStates.pause : playerStates.play;
                  setPlayerState({ ...playerState, state: newState });
                }}
              />
              <IconButton
                background='transparent'
                icon={<MdSkipNext />}
                onClick={() => setPlayerState({ ...playerState, state: playerStates.sk_fwd })}
              />
            </ButtonGroup>
          </Box>
        </HStack>
      </Box>
      <Box>
        {/* track seek or whatever maybe? */}
        <Box>
          Box2
        </Box>
      </Box>
      {/* todo: revise this styling. additional things, perhaps */}
      <Box position='fixed' left='calc(100vw - 12%)' top='calc(100vh - 10%)' w='20%'>
        <HStack>
          <Slider
            min={0}
            max={100}
            onChange={onChangeVolume}
            value={parseInt(playerState.volume*100)}
            step={1}
            w='30%'
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <ButtonGroup size='lg'>
            <IconButton
              background='transparent'
              icon={<MdList />}
            />
          </ButtonGroup>
        </HStack>
      </Box>
    </SimpleGrid>
  );
};

export default Player;