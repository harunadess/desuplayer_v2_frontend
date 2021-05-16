import { Box, Stack, StackDivider } from '@chakra-ui/layout';
import propTypes from 'prop-types';
import React from 'react';

const SideBar = (props) => {
    const { items } = props;
    return (
        <Stack divider={<StackDivider borderColor={'gray.300'} />}>
            {items.map(item => {
                return (
                    <Box key={item.key} onClick={() => onClick(item.key)}>
                        {item.value}
                    </Box>
                );
            })}
        </Stack>
    );
};

SideBar.propTypes = {
    items: propTypes.array.isRequired
};

export default SideBar;