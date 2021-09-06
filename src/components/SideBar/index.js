import { Button } from '@chakra-ui/button';
import { Stack, StackDivider } from '@chakra-ui/layout';
import propTypes from 'prop-types';
import React from 'react';

const SideBar = (props) => {
  const { itemKey, items, onClickItem } = props;
  return (
    <Stack
      divider={<StackDivider borderColor={'gray.300'} />}
      padding={2}
    >
      {items.map(item => {
        return (
          <Button
            alignSelf={'center'}
            key={item[itemKey]}
            onClick={() => onClickItem(item[itemKey])}
            variant={'link'}
          >
            {item.value}
          </Button>
        );
      })}
    </Stack>
  );
};

SideBar.propTypes = {
  itemKey: propTypes.string.isRequired,
  items: propTypes.arrayOf(propTypes.object).isRequired,
  onClickItem: propTypes.func.isRequired
};

export default SideBar;