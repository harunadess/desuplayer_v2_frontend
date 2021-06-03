import { Button } from '@chakra-ui/button';
import { AspectRatio, StackDivider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import React, { useState, useEffect } from 'react';
import * as requests from '../../helpers/request';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import Player from '../Player';
import { Image } from '@chakra-ui/image';
import { typography } from '@chakra-ui/styled-system';
import { Text } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/layout';
import { GridItem } from '@chakra-ui/layout';
import InfiniteScrollList from '../InfiniteScrollList';

// TODO: Currently, you have no idea what the fuck you're doing with the front end or how you want to display things
// you want to have things split out into tabs, but I'm not sure tbh how this is going to work.
// we need some way of accessing each of the possible groups of things
// (maybe object of arrays with a key for each, and we know what tab we're on.. or something)
const MainPanel = () => {
	// These are global things that need shared across the entire application
	const [currentlyPlaying, setCurrentlyPlaying] = useState({});
	const [audioSrc, setAudioSrc] = useState('');
	const [albums, setArtists] = useState([]);
	const itemsIncrement = 8;
	const [numItems, setNumItems] = useState(itemsIncrement);
	const [isLoading, setIsLoading] = useState(false);
	const [tabIdx, setTabIdx] = useState(0);

	useEffect(() => {
		requests.get('music/getAllArtists', {})
		.then(res => {
			setArtists(
				Object.keys(res.data).map(artistKey => {
					const albums = res.data[artistKey].Albums;
					return Object.keys(albums).map(a => ({ ...albums[a], Artist: res.data[artistKey].Name }));
				}).flat()
			);
		}).catch(console.error);
	}, []);

	const onInfiniteScrollBottom = () => {
		setNumItems((currentItems) => currentItems + itemsIncrement);
	}

	const buildLibrary = () => {
		setIsLoading(true);
		requests.get('library/build', { musicDir: '/mnt/d/Users/Jorta/Music', images: false })
		.then(res => {
			setArtists(res.data);
		}).catch(console.error)
		.finally(() => {
			setIsLoading(false);
		});
	};

	useEffect(() => {
		// items = string => Artist
		// Artist = string, string => Album
		// Album = string, string, string, string, string => Song
		// Song =  
		console.log('albums', albums);
	}, [albums]);

	return (
		<Box overflow={'auto'} maxH={'100vh'}>
			<VStack
				align={'stretch'}
				divider={<StackDivider borderColor={'gray.200'}/>}
				spacing={4}
			>
				<Button onClick={buildLibrary} margin={'4'}>Build Library</Button>
				<Tabs
					onChange={(i) => setTabIdx(i)}
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
							<InfiniteScrollList onInfiniteScrollBottom={onInfiniteScrollBottom}>
								<Grid 
									templateColumns={'repeat(4, 1fr)'}
									gap={4}
									maxH={'80vh'}
									maxW={'80vw'}
									overflowY={'auto'}
								>
									{
										albums.slice(0, numItems).map(album => {
											return (
												<GridItem maxW={200}>
													{album.Picturedata?.length > 1 &&
														<AspectRatio ratio={1}>
															<Image
																src={`data:${album.Picturetype};base64,${album.Picturedata}`}
																objectFit={'cover'}
															/>
														</AspectRatio>
													}
													{album.Picturedata?.length <= 1 &&
														<Box w={200} h={200} background={'gray.500'} />
													}
													
													<Text>{album.Title} - {album.Artist}</Text>
												</GridItem>
											);
										})
									}
								</Grid>
							</InfiniteScrollList>
						</TabPanel>
						<TabPanel>
							{/* <AlbumPanel/> */}
						</TabPanel>
						<TabPanel>
							{/* <Song Panel/> */}
						</TabPanel>
					</TabPanels>
				</Tabs>
				<Player
					currentlyPlaying={currentlyPlaying}
					source={audioSrc}
				/>
			</VStack>
		</Box>
	);
};

export default MainPanel;