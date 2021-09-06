import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';

const MainPanelTabs = (props) => {

  const { isLoading, items, itemsIncrement } = props;

  const [displayItems, setDisplayItems] = useState(Object.keys(items).map(i => i.Name));

  const onTabChange = (index) => {
    console.log('onTabChange', index);
    switch (index) {
      case 0:
        setArtistItems();
      case 1:
        setAlbumItems();
      case 2:
        setSongItems();
    }
  };

  const setArtistItems = () => {
    setDisplayItems(Object.keys(items).map(i => i.Name));
  };

  const setAlbumItems = () => {

  };

  const setSongItems = () => {

  };

  return (
    <Tabs
      onChange={onTabChange}
      isFitted
      isLazy
    >
      <TabList>
        <Tab>
          Artists
        </Tab>
        <Tab>
          Albums
        </Tab>
        <Tab>
          Songs
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {displayItems.map(item => {
            <span>{JSON.stringify(item)}</span>
          })}
        </TabPanel>
        <TabPanel>
          {/* <AlbumPanel/> */}
        </TabPanel>
        <TabPanel>
          {/* <Song Panel/> */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

MainPanelTabs.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.object,
  itemsIncrement: propTypes.number
};

export default MainPanelTabs;