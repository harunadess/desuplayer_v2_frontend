import { Box, Center, Grid, GridItem } from '@chakra-ui/layout';
import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Image, Text } from '@chakra-ui/react'

const ItemList = (props) => {
    const bottomOfListRef = useRef(null);
    const boxSize = 250;
    const {
        className,
        infiniteScroll,
        items,
        onClickItem,
        onInfiniteScrollBottom
    }  = props;

    useEffect(() => {
        const options = { root: null, rootMargin: '20px', threshold: 1.0 };
        const observer = new IntersectionObserver(handleIntersection, options);
        if(bottomOfListRef.current)
            observer.observe(bottomOfListRef.current);
    }, []);

    const handleIntersection = (entries) => {
        const target = entries[0];
        if(target.isIntersecting)
            onInfiniteScrollBottom();
    };

	return (
		<Grid
			gap={6}
			maxH={'80vh'}
			overflowY={'auto'}
			templateColumns={'repeat(3, 1fr)'}
		>
			{items.map((item, idx) => {
				return (
					<GridItem boxSize={boxSize} key={`${item.Title}_${item.Artist}_${idx}`} padding={'2'} margin={'4'} onClick={() => onClickItem(item)}>
						<Center>
							{(item.Picturetype && item.Picturedata) &&
								<Image margin={'auto'} src={`data:image/${item.Picturetype};base64,${item.Picturedata}`} />
							}
							{(!item.Picturetype || !item.Picturedata) &&
								<Box margin={'auto'} width={'200px'} h={'200px'} backgroundColor={'gray.200'}>
									<Center>
										<Text fontWeight={'bold'}>No image available</Text>
									</Center>
								</Box>
							}
						</Center>
						<Text fontSize={'md'} textAlign={'center'}>{item.Title || 'No Title available'}</Text>
						<Text fontSize={'md'} textAlign={'center'}>{item.Artist || 'No Artist available'}</Text>
					</GridItem>
				);
			})}
			{infiniteScroll && <Box id={'bottomOfList'} h={40} ref={bottomOfListRef}/>}
		</Grid>
	);
};

ItemList.propTypes = {
    className: propTypes.string,
    infiniteScroll: propTypes.bool,
    items: propTypes.arrayOf(propTypes.object).isRequired,
    listType: propTypes.string,
    onClickItem: propTypes.func,
    onInfiniteScrollBottom: propTypes.func
};

export default ItemList;
