import { FC } from 'react';

import { Box, HStack } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { ButtonGroup, IconButton } from '@chakra-ui/button';
import { MdList } from 'react-icons/md';

interface Props {
  volume: number;
  onChangeVolume: (_: number) => void;
}

const PlayerAdditionalControls: FC<Props> = (props) => {
    const { volume, onChangeVolume } = props;

    return (
      <Box position='fixed' left='calc(100vw - 12%)' top='calc(100vh - 10%)' w='20%'>
        <HStack>
          <Slider
            min={0}
            max={100}
            onChange={onChangeVolume}
            value={Math.floor(volume*100)}
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
    );
};

export default PlayerAdditionalControls;