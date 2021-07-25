import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { StackDivider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import * as requests from '../../helpers/request';
import Player from '../Player';
import ItemList from '../ItemList'

// TODO: Currently, you have no idea what the fuck you're doing with the front end or how you want to display things
// you want to have things split out into tabs, but I'm not sure tbh how this is going to work.
// we need some way of accessing each of the possible groups of things
// (maybe object of arrays with a key for each, and we know what tab we're on.. or something)
const MainPanel = () => {
	// These are global things that need shared across the entire application
	const [currentlyPlaying, setCurrentlyPlaying] = useState({});
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState([]);
	const itemsIncrement = 8;
	const [numItems, setNumItems] = useState(itemsIncrement);
	const [isLoading, setIsLoading] = useState(true);
	const [musicDir, setMusicDir] = useState('D:/Jorta/Music/Alestorm');

	const getAlbums = () => {
		setIsLoading(true);
		return requests.get('library/get');
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
	}

	const buildLibrary = () => {
		setIsLoading(true);
		requests.get('library/build', { musicDir: musicDir, images: false })
		.then(res => {
			setArtists(res.data);
		}).catch(console.error)
		.finally(() => {
			setIsLoading(false);
		});
	};

	return (
		<Box overflow={'auto'} maxH={'100vh'}>
			<VStack
				align={'stretch'}
				divider={<StackDivider borderColor={'gray.200'}/>}
				spacing={4}
			>
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
							displayKeys={['Title', 'Artist']}
							infiniteScroll
							items={Object.keys(library).slice(0, numItems).map(k => library[k])}
							itemKey={'Path'}
							listType={'shitty'}
							onClickItem={() => {}}
							onInfiniteScrollBottom={onInfiniteScrollBottom}
						/>
						<Player
						currentlyPlaying={currentlyPlaying}
						source={audioSrc}
						/>
					</VStack>
				</Box>
			}
			</VStack>
		</Box>
	);
};

export default MainPanel;