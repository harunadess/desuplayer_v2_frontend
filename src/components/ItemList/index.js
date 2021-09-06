import React, { useEffect, useMemo, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Box, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import propTypes from 'prop-types';

const ItemList = (props) => {
  const boxSize = 250;
  const defaultSize = 200;
  const defaultTextOffset = 84;
  const extraPad = 32;

  const {
    items,
    onClickItem,
  } = props;

  // todo: see if this can be refactored any
  // it's kinda gross as is, but as long as it isn't abhorrently bad it's maybe fine:tm:
  const createLayout = (cols, rows, items) => {
    const grid = [];
    for(let x = 0; x < cols; x++) {
      grid.push([]);
      for(let y = 0; y < rows; y++) {
        grid.push([]);
      }
    }

    let x = 0, y = 0;
    for(const it of items) {
      grid[x++][y] = it;
      if(x === cols) {
        x = 0;
        y++;
      }
    }
    return grid;
  };

  const [layout, setLayout] = useState({
    cols: 1,
    rows: 1,
    data: [ [ { } ] ]
  });

  useEffect(() => {
    const cols = window.innerWidth / boxSize;
    const newLayout = {
      cols: Math.floor(cols),
      rows: Math.ceil((items?.length || 1) / cols)
    };
    const data = createLayout(newLayout.cols, newLayout.rows, items)
    setLayout({
      ...newLayout,
      data
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
      style={{
        marginLeft: '3%'
      }}
    >
      {({ rowIndex, columnIndex, style }) => {
        const item = layout.data[columnIndex][rowIndex];
        if(!item) return null;
        return (
          <Box key={`${item.Title}_${item.Artist}_${rowIndex + columnIndex}`} padding='2' margin='4' w={boxSize} h={boxSize}
            onClick={() => onClickItem(item)} style={style}
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

ItemList.propTypes = {
  items: propTypes.arrayOf(propTypes.object).isRequired,
  onClickItem: propTypes.func
};

export default React.memo(ItemList, (prevProps, nextProps) => {
  return (prevProps.items === nextProps.items);
});
