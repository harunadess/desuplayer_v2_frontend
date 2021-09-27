import React from 'react';
import { Box, Divider, Portal, List, ListItem, Text } from '@chakra-ui/react';
import { ContextMenu as CtxMenu, ContextMenuTrigger as CtxMenuTrigger, MenuItem as CtxMenuItem } from 'react-contextmenu';

// need separate selected for context menu
const ContextMenu = (props) => {
  const { children, id, options, selected, setSelected } = props;

  const onClickContextMenuItem = (e, option) => {
    e.stopPropagation();
    console.log('onClickContextMenuItem data -> ', selected);
    options[option].action(selected);
  };

  // todo: style with theme, maybe fix zIndex issue
  return (
    <Box>
      <CtxMenuTrigger id={id}>
        {children}
      </CtxMenuTrigger>
      <Portal>
        <CtxMenu id={id} style={{ zIndex: 9999 }}>
          <List bg='white'>
            {Object.keys(options).map((option, idx) => {
              return (
                <CtxMenuItem key={`${options[option].text}_${idx}`} onClick={(e) => onClickContextMenuItem(e, option)}>
                  <ListItem bg='white' p='1'>
                    <Text fontSize='small' cursor='pointer'>{options[option].text}</Text>
                    <Divider marginTop='1' />
                  </ListItem>
                </CtxMenuItem>
              );
            })}
          </List>
        </CtxMenu>
      </Portal>
    </Box>
  );
};

export default ContextMenu;