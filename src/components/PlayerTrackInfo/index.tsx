import { FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack } from '@chakra-ui/slider';

interface Props {
  currentTime: number;
  maxTime: number;
}

const formatTime = (inputSeconds: number | undefined): string => {
  if(inputSeconds == null) return '00:00';
  const seconds = inputSeconds!;
  let s = (seconds % 60);
  let m = ((seconds - s) / 60) % 60;

  if(Number.isNaN(s)) s = 0;
  if(Number.isNaN(m)) m = 0;

  return `${m < 10 ? `0${m.toFixed(0)}` : m.toFixed(0)}:${s < 10 ? `0${s.toFixed(0)}` : `${s.toFixed(0)}`}`;
};

const PlayerTrackInfo: FC<Props> = (props) => {
    const { currentTime, maxTime } = props;

    return (
      <Box>
        <HStack marginTop='4vh'>
          <Text fontSize='sm' w='25%' whiteSpace='nowrap'>{formatTime(currentTime)} / {formatTime(maxTime)}</Text>
          <Slider min={0} max={maxTime || 0} value={currentTime || 0}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
        </HStack>
      </Box>
    );
};

export default PlayerTrackInfo;