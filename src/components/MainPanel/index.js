import { Button } from '@chakra-ui/button';
import { Grid, GridItem } from '@chakra-ui/layout';
import { StackDivider } from '@chakra-ui/layout';
import { VStack } from '@chakra-ui/layout';
import { Box, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import React, { useState, useEffect, useRef } from 'react';
import * as requests from '../../helpers/request';
import ItemList from '../ItemList';
import Player from '../Player';

const MainPanel = () => {
	const [currentlyPlaying, setCurrentlyPlaying] = useState({});
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState({});
	const itemsIncrement = 20;
	const [numItems, setNumItems] = useState(itemsIncrement);
	const [isLoading, setIsLoading] = useState(false);

	const getLibraryFile = () => {
		return requests.get('library/get');
	};

	useEffect(() => {
		getLibraryFile().then(res => {
			setLibrary(res.data);
		}).catch(error => {
			console.error(error);
		});
	}, []);

	const onInfiniteScrollBottom = () => {
		setNumItems((currentItems) => currentItems + itemsIncrement);
	}

	const buildLibrary = () => {
		setIsLoading(true);
		requests.get('library/build', { musicDir: 'D:/Users/Jorta/Music', images: false })
		.then(res => {
			setLibrary(res.data);
		}).catch(console.error)
		.finally(() => {
			setIsLoading(false);
		});
	};

	const onClickLibraryItem = (itemKey) => {
		requests.get('music/get', { key: itemKey }, 'blob')
		.then(res => {
			setCurrentlyPlaying(library[itemKey]);
			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	return (
		<>
			<Box overflow={'auto'} maxH={'100vh'}>
				<VStack
					align={'stretch'}
					divider={<StackDivider borderColor={'gray.200'}/>}
					spacing={4}
				>
					<Box>
						<Button onClick={buildLibrary} margin={'4'}>Build Library</Button>
						<Button onClick={getLibraryFile} margin={'4'} marginLeft={'0'}>Get Library File</Button>
					</Box>
					{isLoading &&
						<Grid
						gap={6}
						maxH={'80vh'}
						overflowY={'auto'}
						templateColumns={'repeat(3, 1fr)'}
						>
							{[1,2,3,4,5].map(i => {
								return (
									<React.Fragment key={`skeleton_loading_${i}`}>
										<GridItem><Skeleton color={'blackAlpha.300'} width={'320px'} height={'120px'}/></GridItem>
										<GridItem><Skeleton color={'blackAlpha.300'} width={'320px'} height={'120px'}/></GridItem>
										<GridItem><Skeleton color={'blackAlpha.300'} width={'320px'} height={'120px'}/></GridItem>
									</React.Fragment>
								);
							})}
						</Grid>
					}
					{!isLoading &&
						<ItemList
							displayKeys={['Album', 'Artist', 'FileType', 'Title', 'Year']}
							infiniteScroll
							items={Object.keys(library).slice(0, numItems).map(k => library[k])}
							itemKey={'Key'}
							listType={'shitty'}
							onClickItem={onClickLibraryItem}
							onInfiniteScrollBottom={onInfiniteScrollBottom}
						/>
					}
					<Player
						currentlyPlaying={currentlyPlaying}
						source={audioSrc}
					/>
				</VStack>
			</Box>
		</>
	);
};

export default MainPanel;