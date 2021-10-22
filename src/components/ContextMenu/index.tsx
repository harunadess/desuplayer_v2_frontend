import { FC } from 'react';
import { Box, Divider, Portal, List, ListItem, Text } from '@chakra-ui/react';
import { ContextMenu as CtxMenu, ContextMenuTrigger as CtxMenuTrigger, MenuItem as CtxMenuItem } from 'react-contextmenu';
import { ContextMenuOptions } from '../../constants';
import { Playable } from '../../types/data/library';

interface Props {
  id: string;
  options: ContextMenuOptions;
  selected: Playable;
}

type ClickEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>;

// need separate selected for context menu
const ContextMenu: FC<Props> = (props) => {
  const { children, id, options, selected } = props;

  const onClickContextMenuItem = (e: ClickEvent, option: keyof ContextMenuOptions) => {
    e.stopPropagation();
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
            {Object.keys(options).map((key, idx) => {
              const option = key as keyof ContextMenuOptions;
              return (
                <CtxMenuItem key={`${options[option].text}_${idx}`} onClick={(e: ClickEvent) => {
                  console.log('called click', e, option);
                  onClickContextMenuItem(e, option)
                }}>
                  <ListItem bg='white' p='2' paddingRight='4'>
                    <Text fontSize='small' cursor='pointer'>{options[option].text}</Text>
                    <Divider marginTop='0.5' p='0.5' paddingRight='4' />
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