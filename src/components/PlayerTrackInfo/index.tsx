import { FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack } from '@chakra-ui/slider';

interface Props {
  currentTime: number;
  maxTime: number;
}

const formatTime = (seconds: number): string => {
  const s = (seconds % 60);
  const m = ((seconds - s) / 60) % 60;
  return `${m < 10 ? `0${m.toFixed(0)}` : m.toFixed(0)}:${s < 10 ? `0${s.toFixed(0)}` : `${s.toFixed(0)}`}`;
};

const PlayerTrackInfo: FC<Props> = (props) => {
    const { currentTime, maxTime } = props;

    return (
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
    );
};

export default PlayerTrackInfo;