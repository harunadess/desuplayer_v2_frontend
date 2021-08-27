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
        itemKey,
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
			{items.map(item => {
				return (
					<GridItem boxSize={boxSize} key={`${item.Title}_${item.Artist}`} onClick={() => onClickItem(item)}>
						<Center>
							<Image margin={'auto'} src={`data:image/${item.Picturetype};base64,${item.Picturedata}`} />
						</Center>
						<Text fontSize={'lg'} textAlign={'center'}>{item.Title}</Text>
						<Text fontSize={'lg'} textAlign={'center'}>{item.Artist}</Text>
					</GridItem>
				);
			})}
			{infiniteScroll && <Box id={'bottomOfList'} h={40} ref={bottomOfListRef}/>}
		</Grid>
	);
};

ItemList.propTypes = {
    className: propTypes.string,
    displayKeys: propTypes.arrayOf(propTypes.string).isRequired,
    infiniteScroll: propTypes.bool,
    items: propTypes.arrayOf(propTypes.object).isRequired,
    listType: propTypes.string,
    onClickItem: propTypes.func,
    onInfiniteScrollBottom: propTypes.func
};

export default ItemList;
