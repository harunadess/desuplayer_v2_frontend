import { useEffect, useState, useRef, FC } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Box, HStack, SimpleGrid } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { MdList, MdPauseCircleOutline, MdPlayCircleOutline, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import { Text } from '@chakra-ui/layout';
import { ButtonGroup } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';

import { default as musicApi } from '../../api/music';
import { playerStates } from '../../constants';
import { Song, SongMeta } from '../../types/data/library';

const maxHeight = 100;
// const layoutSizes = {
//   mainControls: { h: maxHeight, w: 100 },
//   albumAndDeets: { h: maxHeight, w: 100 },
//   auxControls: { h: maxHeight, w: 500 }
// };

const formatTime = (seconds: number): string => {
  const s = (seconds % 60);
  const m = ((seconds - s) / 60) % 60;
  return `${m < 10 ? `0${m.toFixed(0)}` : m.toFixed(0)}:${s < 10 ? `0${s.toFixed(0)}` : `${s.toFixed(0)}`}`;
};

interface PlayerState {
  currentSong?: SongMeta;
  index: number;
  source: string;
  state: playerStates;
  previousState: playerStates;
  volume: number;
}

interface Props {
  playlist: Song[],
  setPlaylist: (_: Song[] | ((prevState: Song[]) => Song[])) => void;
}

const Player: FC<Props> = (props) => {
  const { playlist, setPlaylist } = props;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playerState, setPlayerState] = useState(() => ({
    currentSong: undefined,
    index: 0,
    source: '',
    state: playerStates.end,
    previousState: playerStates.end,
    volume: 0.20
  } as PlayerState));
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const play = () => {
    console.log('play');
    if(playerState.source) {
      console.log('already exists, resume');
      if(audioRef.current) {
        audioRef.current.play();
      }
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

    let current = { ...next } as SongMeta;
    musicApi.getSongMeta(current.Path, current.AlbumArtist || current.Artist, current.AlbumTitle).then((songMeta) => {
      current = songMeta;
    }).finally(() => {
      musicApi.getSong(current.Path).then((songData) => {
        setPlayerState({
          ...playerState,
          currentSong: current,
          source: window.URL.createObjectURL(songData),
        });
        if(audioRef.current) {
          audioRef.current.volume = playerState.volume;
          audioRef.current.load();
          audioRef.current.play();
        }
      });
    });
  };

  const pause = () => {
    console.log('pause');
    if(audioRef.current) {
      audioRef.current.pause();
    }
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

    if(audioRef.current) {
      audioRef.current.pause();
    }

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

    if(audioRef.current) {
      audioRef.current.pause();
    }

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
    } else {
      setPlayerState({
        ...playerState,
        source: '',
        index: 0,
        state: playerStates.end
      });
    }
  };

  const onChangeVolume = (value: number) => {
    if(audioRef.current) {
      audioRef.current.volume = (value * 0.01);
    }
    setPlayerState({
      ...playerState,
      volume: (value*0.01)
    });
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

  useEffect(() => {
    const updateTime = () => {
      if(audioRef.current) {
        setCurrentTime(Math.floor(audioRef.current.currentTime));
        setMaxTime(Math.floor(audioRef.current.duration));
      }
    };

    if(playerState.source && audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
    }

    return () => {
      if (playerState.source && audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime);
      }
    }
  }, [playerState.source]);

  return (
    // todo: this might be a job for regular Grid after all, but instead you figure out how to use it
    <>
      {playerState.source &&
        <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={() => setPlayerState({ ...playerState, state: playerStates.end }) } />
      }
      <SimpleGrid columns={3} height='15%'>
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
              <Text fontSize='sm' textAlign='left' textOverflow='ellipsis' overflow='hidden' whiteSpace='pre'>
                {`${playerState.currentSong?.Title || 'No Title available'}\n`}
                {playerState.currentSong?.Artist || 'No Artist available'}
              </Text>
            </Box>
            <Box>
              <ButtonGroup size='lg'>
                <IconButton
                  aria-label='Previous'
                  background='transparent'
                  icon={<MdSkipPrevious  />}
                  onClick={() => setPlayerState({ ...playerState, state: playerStates.sk_bk })}
                />
                <IconButton
                  aria-label='Play/Pause'
                  background='transparent'
                  icon={(playerState.state === playerStates.play) ? <MdPauseCircleOutline /> : <MdPlayCircleOutline />}
                  onClick={() => {
                    const state = playerState.state;
                    const newState = state === playerStates.play ? playerStates.pause : playerStates.play;
                    setPlayerState({ ...playerState, state: newState });
                  }}
                />
                <IconButton
                  aria-label='Next'
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
            <HStack marginTop='4vh'>
              <Text fontSize='sm' w='20%'>{formatTime(currentTime)} / {formatTime(maxTime)}</Text>
              <Slider min={0} max={maxTime} value={currentTime}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
              </Slider>
            </HStack>
          </Box>
        </Box>
        {/* todo: revise this styling. additional things, perhaps */}
        <Box position='fixed' left='calc(100vw - 12%)' top='calc(100vh - 10%)' w='20%'>
          <HStack>
            <Slider
              min={0}
              max={100}
              onChange={onChangeVolume}
              value={Math.floor(playerState.volume*100)}
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
                aria-label='Playlist'
                background='transparent'
                icon={<MdList />}
              />
            </ButtonGroup>
          </HStack>
        </Box>
      </SimpleGrid>
    </>
  );
};

export default Player;