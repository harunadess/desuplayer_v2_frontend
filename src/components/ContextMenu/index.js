import React, { useState } from 'react';
import { Box, Divider, List, ListItem, Text } from '@chakra-ui/layout';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@chakra-ui/popover';

/* 
  ContextMenu will have to be implemented differently..
  By that, I mean that you will need to do it like an actual context menu and not around each item in ItemList
  as that is way too resource intensive and makes everything real slow
*/
const ContextMenu = (props) => {
  const {
    children,
    options,
    itemData
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(new Array(Object.keys(options).length).fill(false));

  const toggleIsHover = (idx) => {
    setIsHover((isHover) => {
      const newIsHover = [ ...isHover ];
      newIsHover[idx] = !newIsHover[idx];
      return newIsHover;
    });
  };

  return (
    <Popover closeOnBlur isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <Box onAuxClick={() => setIsOpen(!isOpen)}>
            {children}
          </Box>
        </PopoverTrigger>
        <PopoverContent outlineColor='gray.300'>
          <PopoverArrow outline='gray.400' />
          <PopoverBody>
            <List>
              {Object.keys(options).map((option, idx) => {
                return (
                  <ListItem key={`${options[option].text}_${idx}`} onClick={() => options[option].action(itemData)} cursor='pointer'
                    onMouseEnter={() => toggleIsHover(idx)} onMouseLeave={() => toggleIsHover(idx)}
                    style={{ backgroundColor: isHover[idx] ? 'var(--chakra-colors-gray-50)' : 'inherit' }}
                  >
                    <Text>{options[option].text}</Text>
                    <Divider />
                  </ListItem>
                );
              })}
            </List>
          </PopoverBody>
        </PopoverContent>
    </Popover>
  );
};

export default React.memo(ContextMenu);