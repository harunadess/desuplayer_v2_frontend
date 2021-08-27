import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { StackDivider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerOverlay, DrawerFooter } from '@chakra-ui/react';
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
	const itemsIncrement = 8;
	const [numItems, setNumItems] = useState(itemsIncrement);
	const [isLoading, setIsLoading] = useState(true);
	const [musicDir, setMusicDir] = useState('D:/Users/Jorta/Music/Alestorm');
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
			console.log(res);

			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			console.log(trackURL);
			setAudioSrc(trackURL);
		}).catch(console.error)
	};

	return (
		<Box overflow={'auto'} maxH={'100vh'}>
			<Button onClick={buildLibrary} margin={'4'}>Build Library</Button>
			{!isLoading &&
				<Box overflow={'auto'} maxH={'100vh'}>
					<VStack
						align={'stretch'}
						divider={<StackDivider borderColor={'gray.200'}/>}
						spacing={4}
					>
						<Box>
							<Text hidden={!isLoading} padding={'2'} margin={'4'}>-- Api Request in Progress -- </Text>
							<Input type={'text'} value={musicDir} onChange={(event) => setMusicDir(event.target.value)}/>
							<Button onClick={buildLibrary} margin={'4'}>Build</Button>
							<Button onClick={getAlbums} margin={'4'} marginLeft={'0'}>Manual Get</Button>
						</Box>
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
				<Drawer isOpen={selectedAlbum.Title} placement={'right'} onClose={() => { setSelectedAlbum({}) }} size={'md'}>
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
										<Button colorScheme={'gray'} key={key} variant={'ghost'} onClick={() => { onClickSong(song) }} fontSize={'md'}>
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