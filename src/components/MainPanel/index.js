import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { StackDivider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter, HStack } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import * as requests from '../../helpers/request';
import Player from '../Player';
import ItemList from '../ItemList';

// (maybe object of arrays with a key for each, and we know what tab we're on.. or something)
const MainPanel = () => {
	// These are global things that need shared across the entire application
	const [currentlyPlaying, setCurrentlyPlaying] = useState({});
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState([]);
	const itemsIncrement = 9;
	const [numItems, setNumItems] = useState(itemsIncrement);
	const [isLoading, setIsLoading] = useState(true);
	const [musicDir, setMusicDir] = useState('D:/Users/Jorta/Music');
	const [selectedAlbum, setSelectedAlbum] = useState({});
	const [selectedSong, setSelectedSong] = useState({});

	const getAlbums = () => {
		setIsLoading(true);
		return requests.get('music/getAllArtists');
	};

	useEffect(() => {
		getAlbums().then(res => {
			setLibrary(res.data);
		}).catch(error => {
			console.error(error);
		}).finally(() => {
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		requests.get('music/getAllArtists', {})
		.then(res => {
			setLibrary(res.data);
		}).catch(console.error);
	}, []);

	const onInfiniteScrollBottom = () => {
		setNumItems((currentItems) => currentItems + itemsIncrement);
	};

	const buildLibrary = () => {
		setIsLoading(true);
		requests.get('library/build', { musicDir: musicDir })
		.then(res => {
			setLibrary(res.data);
		}).catch(console.error)
		.finally(() => {
			setIsLoading(false);
		});
	};

	const onClickAlbum = (item) => {
		console.log('clicked ->', item);
		setSelectedAlbum(item);
	};

	const onClickSong = (item) => {
		console.log('clicked =>', item);
		setSelectedSong(item);

		// todo: remove
		requests.get('music/getSong', { path: item.Path }, 'blob')
		.then(res => {
			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			const trackURL = window.URL.createObjectURL(track);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	return (
		<Box>
			<HStack spacing={'4'} margin={'8'}>
				<Input maxW={'50%'} size={'sm'} type={'text'} value={musicDir} onChange={(event) => setMusicDir(event.target.value)}/>
				<Button size={'sm'} onClick={buildLibrary} margin={'4'}>Build</Button>
				<Button size={'sm'} onClick={getAlbums} margin={'4'}>Manual Get</Button>
			</HStack>
			{!isLoading &&
				<Box overflow={'auto'}>
					<VStack
						align={'stretch'}
						divider={<StackDivider borderColor={'gray.200'}/>}
						spacing={4}
					>
						<ItemList
							infiniteScroll
							items={library.slice(0, numItems)}
							itemKey={'Path'}
							onClickItem={onClickAlbum}
							onInfiniteScrollBottom={onInfiniteScrollBottom}
						/>
						<Player
						currentlyPlaying={currentlyPlaying}
						source={audioSrc}
						/>
					</VStack>
				</Box>
			}
			{selectedAlbum.Title !== undefined &&
				<Drawer isOpen={selectedAlbum.Title} placement={'right'} onClose={() => { setSelectedAlbum({}) }} size={'sm'}>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton />
						<DrawerHeader>
							{selectedAlbum.Title}
						</DrawerHeader>
						<DrawerBody>
							<VStack>
								{Object.keys(selectedAlbum.Songs).map(key => {
									const song = selectedAlbum.Songs[key];
									return (
										<Button colorScheme={'gray'} key={key} variant={'ghost'} onClick={() => { onClickSong(song) }} fontSize={'sm'}>
											{song.Tracknumber}. {song.Title}
										</Button>
									);
								})}
							</VStack>
						</DrawerBody>
						<DrawerFooter />
					</DrawerContent>
				</Drawer>
			}
		</Box>
	);
};

export default MainPanel;