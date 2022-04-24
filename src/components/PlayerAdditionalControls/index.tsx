import { FC, useState } from 'react';

import { Box, HStack } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { ButtonGroup, IconButton } from '@chakra-ui/button';
import { MdList } from 'react-icons/md';
import { Song } from '../../types/data/library';
import { Menu, MenuButton, MenuItemOption, MenuList, Portal } from '@chakra-ui/react';

interface Props {
  volume: number;
  onChangeVolume: (_: number) => void;
  songsUpNext: Song[];
}

const PlayerAdditionalControls: FC<Props> = (props) => {
    const { volume, onChangeVolume, songsUpNext } = props;

    // const [upNextOpen, setUpNextIsOpen] = useState(false);

    return (
      // <Box position='fixed' left='calc(100vw - 12%)' top='calc(100vh - 10%)' w='20%'>
      <Box marginTop='6'>
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
            {/* note: this is borked */}
            <Menu
              aria-label='open/close up next list'
              closeOnBlur
              closeOnSelect={false}
              isLazy
            >
              <MenuButton>
                <IconButton
                  aria-label='up next button'
                  background='transparent'
                  icon={<MdList/>}
                />
              </MenuButton>
              <Portal>
                <MenuList>
                  {songsUpNext.map(song => 
                    <MenuItemOption>{song.Title} - {song.Artist}</MenuItemOption>
                  )}
                </MenuList>
              </Portal>
            </Menu>

            {/* // <IconButton
            //   aria-label='Playlist'
            //   background='transparent'
            //   onClick={() => setUpNextIsOpen((state) => !state)}
            //   icon={<MdList />}
            // /> */}
          </ButtonGroup>
        </HStack>
      </Box>
    );
};

export default PlayerAdditionalControls;