import { FC } from 'react';
import { AspectRatio, Box, HStack, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { ButtonGroup, IconButton } from '@chakra-ui/button';
import { MdPauseCircleOutline, MdPlayCircleOutline, MdSkipNext, MdSkipPrevious } from 'react-icons/md';

import { PlayerState } from '../Player';
import { playerStates } from '../../constants';

interface Props {
    playerState: PlayerState;
    setPlayerState: (_: PlayerState | ((prevState: PlayerState) => PlayerState)) => void;
    maxHeight: number;
}

const PlayerCurrentlyPlaying: FC<Props> = (props) => {
    const { playerState, setPlayerState, maxHeight } = props;

    return (
        <Box>
          <HStack spacing='4'>
            <Box key={`Player_${playerState.currentSong?.Title}_${playerState.currentSong?.Artist}`}>
              {(playerState.currentSong?.Picturetype && playerState.currentSong?.Picturedata) &&
                <AspectRatio maxW={maxHeight} ratio={1}>
                  <Image margin='auto' src={`data:image/${playerState.currentSong?.Picturetype};base64,${playerState.currentSong?.Picturedata}`} />
                </AspectRatio>
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
    );
};

export default PlayerCurrentlyPlaying;
