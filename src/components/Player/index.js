import React, { useEffect, useState, useRef } from 'react';
import propTypes from 'prop-types';

import { IconButton } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { MdGraphicEq, MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import { Grid, GridItem } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { ButtonGroup } from '@chakra-ui/button';

import { default as musicApi } from '../../api/music';

const Player = (props) => {
  const { playlist, setPlaylist } = props;

  const audioRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    currentSong: undefined,
    source: '',
    isPlaying: false,
    previouslyPlayed: []
  });

  const onClickPlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setPlayerState({ ...playerState, isPlaying: !playerState.isPlaying });
    } else {
      if(!playerState.currentSong || !playerState.source) {
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
      } else {
        audioRef.current.play();
        setPlayerState({ ...playerState, isPlaying: !playerState.isPlaying });
      }
    }
  };

  const onChangeVolume = (value) => {
    audioRef.current.volume = value;
  };

  return (
    <Box>
      {playerState.source &&
        <audio autoPlay={false} src={playerState.source} ref={audioRef} />
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
              max={1}
              onChange={onChangeVolume}
              step={0.01}
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

export default Player;