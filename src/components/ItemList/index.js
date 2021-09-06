import React, { useEffect, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Box, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import propTypes from 'prop-types';
import { forwardRef } from '@chakra-ui/react';

const ItemList = (props) => {
  const boxSize = 250;
  const defaultSize = 200;
  const defaultTextOffset = 84;
  const extraPad = 32;

  const {
    items,
    onClickItem,
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
      rowHeight={boxSize + extraPad}
      width={window.innerWidth || 0}
      height={window.innerHeight || 0}
      itemCount={items.length}
      innerElementType={ItemElem}
      style={{
        marginLeft: '3%'
      }}
    >
      {({ rowIndex, columnIndex, style }) => {
        const item = items[rowIndex + columnIndex];
        return (
          <Box key={`${item.Title}_${item.Artist}_${rowIndex + columnIndex}`} padding='2' margin='4' w={boxSize} h={boxSize}
            onClick={() => { onClickItem(item) }} style={style}
          >
            {(item.Picturetype && item.Picturedata) &&
              <Image margin='auto' src={`data:image/${item.Picturetype};base64,${item.Picturedata}`} cursor='pointer' />
            }
            {(!item.Picturetype || !item.Picturedata) &&
              <Box margin='auto' width={defaultSize} h={defaultSize} backgroundColor='gray.200' cursor='pointer'>
                <Text paddingTop={defaultTextOffset} align='center' fontWeight='bold'>No image available</Text>
              </Box>
            }
            <Text fontSize='md' textAlign='center' textOverflow='ellipsis' overflow='hidden' cursor='pointer'>
              {item.Title || 'No Title available'}<br />
              {item.Artist || 'No Artist available'}
            </Text>
          </Box>
        );
      }}
    </FixedSizeGrid>
  );
};

const ItemElem = forwardRef(({ style, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        padding: '0.5rem',
        margin: '1rem'
      }}
      {...rest}
    />
  );
});

ItemList.propTypes = {
  items: propTypes.arrayOf(propTypes.object).isRequired,
  onClickItem: propTypes.func
};

export default ItemList;
