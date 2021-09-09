import React from 'react';
import { Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';

const ContextMenu = (props) => {
  const {
    children,
    elementType,
    options,
    itemData
  } = props;

  // todo: replace with some implementation of https://chakra-ui.com/docs/overlay/popover
  return (
    <Menu isLazy>
      <MenuButton as={elementType}>{children}</MenuButton>
      <MenuList alignSelf='center'>
        {Object.keys(options).map((option, idx) => {
          return (
            <MenuItem key={`${option}_${idx}`} onClick={() => options[option].action(itemData)}><Text>{options[option].text}</Text></MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ContextMenu;