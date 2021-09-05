import React, { useEffect, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Box, Center, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import propTypes from 'prop-types';

const ItemList = (props) => {
	const boxSize = 250;

	const {
		items,
		onClickItem,
		onInfiniteScrollBottom
	} = props;

	const [layout, setLayout] = useState({ cols: 1, rows: 1 });

	useEffect(() => {
		const cols = window.innerWidth / boxSize;
		setLayout({
			cols: Math.floor(cols),
			rows: Math.ceil((items?.length || 1) / cols)
		});
	}, [items.length, window.innerWidth]);

	return (
		<FixedSizeGrid
			columnCount={layout.cols}
			rowCount={layout.rows}
			columnWidth={boxSize}
			rowHeight={boxSize}
			width={window.innerWidth || 0}
			height={window.innerHeight || 0}
			itemCount={items.length}
		>
			{({rowIndex, columnIndex, style}) => {
				const item = items[rowIndex + columnIndex];
				return (
					<Box key={`${item.Title}_${item.Artist}_${rowIndex + columnIndex}`} padding={'2'} margin={'4'} w={boxSize} h={boxSize} onClick={() => { onClickItem(item) }} style={style}>
						<Center>
							{(item.Picturetype && item.Picturedata) &&
								<Image margin={'auto'} src={`data:image/${item.Picturetype};base64,${item.Picturedata}`} />
							}
							{(!item.Picturetype || !item.Picturedata) &&
								<Box margin={'auto'} width={'200px'} h={'200px'} backgroundColor={'gray.200'}>
									<Center>
										<Text margin={'auto'} fontWeight={'bold'}>No image available</Text>
									</Center>
								</Box>
							}
						</Center>
						<Text fontSize={'md'} textAlign={'center'}>{item.Title || 'No Title available'}</Text>
						<Text fontSize={'md'} textAlign={'center'}>{item.Artist || 'No Artist available'}</Text>
					</Box>
				);
			}}
		</FixedSizeGrid>
	);
};

ItemList.propTypes = {
    infiniteScroll: propTypes.bool,
    items: propTypes.arrayOf(propTypes.object).isRequired,
    listType: propTypes.string,
    onClickItem: propTypes.func,
    onInfiniteScrollBottom: propTypes.func
};

export default ItemList;
