import { useEffect, useState, useRef, FC } from 'react';
import { SimpleGrid } from '@chakra-ui/layout';

import { default as musicApi } from '../../api/music';
import { playerStates } from '../../constants';
import { Song, SongMeta } from '../../types/data/library';
import PlayerCurrentlyPlaying from '../PlayerCurrentlyPlaying';
import PlayerTrackInfo from '../PlayerTrackInfo';
import PlayerAdditionalControls from '../PlayerAdditionalControls';

const maxHeight = '100px';
// const layoutSizes = {
//   mainControls: { h: maxHeight, w: 100 },
//   albumAndDeets: { h: maxHeight, w: 100 },
//   auxControls: { h: maxHeight, w: 500 }
// };


export interface PlayerState {
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
  shouldStartPlaying: boolean;
  setShouldStartPlaying: (_: boolean | ((prevState: boolean) => boolean)) => void;
}

// todo: this needs refactored to fuck
//   i don't know if you can have a helper or something
const Player: FC<Props> = (props) => {
  const { playlist, setPlaylist, shouldStartPlaying, setShouldStartPlaying } = props;

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

  const play = (forcePlay: boolean = false) => {
    console.log('play');
    if(!forcePlay && playerState.source) {
      console.log('already exists, resume');
      if(audioRef.current) {
        audioRef.current.play();
      }
      return;
    }

    if(forcePlay) {
      if(audioRef.current) {
        audioRef.current.pause();
      }
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
        const dataObj = window.URL.createObjectURL(songData);
        setPlayerState({
          ...playerState,
          state: playerStates.play,
          currentSong: current,
          source: dataObj,
        });
        if(audioRef.current) {
          audioRef.current.src = dataObj; 
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
      if(playerState.index + 1 >= playlist.length) {
        setPlaylist([]);
        setPlayerState({
          ...playerState,
          currentSong: undefined,
          source: '',
          index: 0,
          state: playerStates.end
        });
      } else {
        setPlayerState({
          ...playerState,
          source: '',
          index: playerState.index + 1,
          state: playerStates.play
        });
      }
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
      audioRef.current.volume = (value*0.01);
    }
    setPlayerState({
      ...playerState,
      volume: (value*0.01)
    });
  };

   useEffect(() => {
    console.log('playlist updated', playlist);
  }, [playlist]);

  useEffect(() => {
    console.log('updated player state:', playerState);

    if(playerState.state === playerStates.end)
      end();
    if(playerState.state === playerStates.play)
      play(shouldStartPlaying);
    if(playerState.state === playerStates.pause)
      pause();
    if(playerState.state === playerStates.sk_bk)
      sk_bk();
    if(playerState.state === playerStates.sk_fwd)
      sk_fwd();

    if(shouldStartPlaying) setShouldStartPlaying(false);
  }, [playerState.state]);

  useEffect(() => {
    const audioElem = audioRef.current;

    const updateTime = () => {
      if(audioElem) {
        setCurrentTime(Math.floor(audioElem.currentTime));
        setMaxTime(Math.floor(audioElem.duration));
      }
    };

    if(playerState.source && audioElem) {
      audioElem.addEventListener('timeupdate', updateTime);
    }

    return () => {
      if (playerState.source && audioElem) {
        audioElem.removeEventListener('timeupdate', updateTime);
      }
    }
  }, [playerState.source]);

  return (
    // todo: this might be a job for regular Grid after all, but instead you figure out how to use it
    <>
      <audio autoPlay={false} src={playerState.source} ref={audioRef} onEnded={() => setPlayerState({ ...playerState, state: playerStates.end }) } hidden />
      <SimpleGrid columns={3} height='15%'>
        {/* album box and details & main controls */}
        <PlayerCurrentlyPlaying playerState={playerState} setPlayerState={setPlayerState} maxHeight={maxHeight} />
        <PlayerTrackInfo currentTime={currentTime} maxTime={maxTime} />
        {/* todo: revise this styling. additional things, perhaps */}
        <PlayerAdditionalControls volume={playerState.volume} onChangeVolume={onChangeVolume} />

      </SimpleGrid>
    </>
  );
};

export default Player;
