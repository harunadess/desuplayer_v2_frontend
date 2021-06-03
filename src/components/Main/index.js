import { Flex, Grid, GridItem } from '@chakra-ui/layout';
import React from 'react';
import SideBar from '../SideBar';
import MainPanel from '../MainPanel';

const sidebarItems = [
    { key: 'one', value: 'One' },
    { key: 'two', value: 'Two' },
    { key: 'three', value: 'Three' },
    { key: 'four', value: 'Four' },
];

const Main = () => {
    return (
        <Flex flex={1} maxHeight={'100vh'}>
            <Grid
                gap={6}
                templateColumns={"repeat(12, 1fr)"}
            >
                <GridItem colSpan={2}>
                    <SideBar itemKey={'key'} items={sidebarItems}/>
                </GridItem>
                <GridItem colSpan={10} overflowY={'auto'}>
                    <MainPanel/>
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default Main;