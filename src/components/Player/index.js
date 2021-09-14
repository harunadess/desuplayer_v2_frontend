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

const maxHeight = 100;
const layoutSizes = {
  mainControls: { h: maxHeight, w: 100 },
  albumAndDeets: { h: maxHeight, w: 100 },
  auxControls: { h: maxHeight, w: 500 }
};

/*
  Todo: figure out how player events are going to work
  Since the playerState is async, you might need some kinda useEffect with something that
  manages updates based on player events (start, stop, end or whatever) and then do things based on that
  (like fetch new song, etc.)
*/
const Player = (props) => {
  const { playlist, setPlaylist } = props;

  const audioRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    currentSong: undefined,
    source: '',
    isPlaying: false,
    previouslyPlayed: []
  });

  const initialPlay = () => {
    const current = { ...playlist[0] };
    setPlayerState({ ...playerState, currentSong: current });
    musicApi.getSong(current.Path).then((songData) => {
      setPlayerState({
        ...playerState,
        currentSong: current,
        source: window.URL.createObjectURL(songData),
        isPlaying: !playerState.isPlaying
      });
      audioRef.current.play();
    });
  };

  const onClickPlayPause = () => {
    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState({ ...playerState, isPlaying: !playerState.isPlaying });
    } else {
      if(!playerState.currentSong || !playerState.source) {
        initialPlay();
      } else {
        audioRef.current.play();
        setPlayerState({ ...playerState, isPlaying: !playerState.isPlaying });
      }
    }
  };

  const onChangeVolume = (value) => {
    if(audioRef?.current?.volume)
      audioRef.current.volume = (value*0.01);
  };

  const onSongEnd = () => {
    const ended = playerState.currentSong;
    setPlaylist(playlist.slice(1));
    setPlayerState({
      ...playerState,
      currentSong: undefined,
      source: '',
      isPlaying: false,
      previouslyPlayed: playerState.previouslyPlayed.push(ended)
    });
    onClickPlayPause();
  };

  const oldUI = () => {
    return (
      <Box>
        {playerState.source &&
          <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={onSongEnd} />
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
                onClick={onClickPlayPause}
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

  return (
    // todo: this might be a job for regular Grid after all, but instead you figure out how to use it
    <SimpleGrid columns={3} height='15%'>
      {playerState.source &&
        <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={onSongEnd} />
      }
      {/* album box and details & main controls */}
      <Box>
        <HStack spacing='4'>
          <Box key={`Player_${playerState.currentSong?.Title}_${playerState.currentSong?.Artist}`}>
            {(playerState.currentSong?.Picturetype && playerState.currentSong?.Picturedata) &&
              <Image margin='auto' src={`data:image/${playerState.currentSong?.Picturetype};base64,${playerState.currentSong?.Picturedata}`} />
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
                onClick={() => console.log('previous')}
              />
              <IconButton
                background='transparent'
                icon={playerState.isPlaying ? <MdPauseCircleOutline /> : <MdPlayCircleOutline />}
                onClick={onClickPlayPause}
              />
              <IconButton
                background='transparent'
                icon={<MdSkipNext />}
                onClick={() => console.log('next')}
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
              onClick={() => console.log('previous')}
            />
          </ButtonGroup>
        </HStack>
      </Box>
    </SimpleGrid>
  );
};

export default Player;