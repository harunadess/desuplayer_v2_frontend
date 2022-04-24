import React, { FC, useCallback, useEffect, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Box, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import ContextMenu from '../ContextMenu';
import { ContextMenuOptions, playlistContextMenuId } from '../../constants';
import { Album } from '../../types/data/library';
import { debounce } from '../../helpers/debounce';

const gridStyle = { marginLeft: '3%' };

const createLayout = (cols: number, rows: number, items: Album[]) => {
  const grid = [] as Album[][];
  for(let x = 0; x < cols; x++) grid.push([]);

  let x = 0;
  for(const it of items) {
    grid[x].push(it);
    x++;
    if(x === cols) {
      x = 0;
    }
  }
  return grid;
};

interface Props {
  contextMenuOptions: ContextMenuOptions;
  items: Album[];
  onClickItem: (item: Album) => void;
  selected: Album | {};
  setSelected: (selected: Album | {} | ((prevState: Album | {}) => void)) => void;
}

interface GridLayout {
  cols: number;
  rows: number;
  data: Album[][];
}

const ItemList: FC<Props> = (props) => {
  const boxSize = 250;
  const defaultSize = 200;
  const defaultTextOffset = 84;
  const resizeDebounceMs = 100;

  const extraPad = 32;

  const { contextMenuOptions, items, onClickItem } = props;
  const [layout, setLayout] = useState<GridLayout>(() => ({ cols: 1, rows: 1, data: [[]] }));
  const [windowDimensions, setWindowDimensions] = useState(() => [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const debouncedResize = debounce(() => {
      setWindowDimensions([window.innerWidth, window.innerHeight]);
    }, resizeDebounceMs);

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  });

  useEffect(() => {
    const [width] = windowDimensions;
    const cols = width / boxSize;
    const newLayout = {
      cols: Math.floor(cols),
      rows: Math.ceil((items?.length || 1) / cols)
    };
    const data = createLayout(newLayout.cols, newLayout.rows, items)
    setLayout({
      ...newLayout,
      data: data
    });
    console.log('data:', data);
  }, [items, windowDimensions]);

  const onClickGridItem = useCallback((item: Album) => {
    onClickItem(item);
  }, [onClickItem]);

  return (
    <FixedSizeGrid
      columnCount={layout.cols}
      rowCount={layout.rows}
      columnWidth={boxSize}
      rowHeight={boxSize + extraPad}
      width={windowDimensions[0] || 0}
      height={windowDimensions[1] || 0}
      // todo: come back and see if you can resolve
      // itemCount={items.length}
      style={gridStyle}
    >
      {({ rowIndex, columnIndex, style }) => {
        const item = layout.data[columnIndex][rowIndex];
        if (!item) return null;
        return (
          <Box key={`${item.Title}_${item.Artist}_${rowIndex + columnIndex}`} padding='2' margin='4' w={boxSize} h={boxSize} cursor='pointer'
            onClick={() => onClickGridItem(item)} style={style} alignItems='center'
          >
            <ContextMenu id={`${playlistContextMenuId}_${item.Title}_${item.Artist}_${rowIndex + columnIndex}`} options={contextMenuOptions} selected={item}>
              {(item.Picturetype && item.Picturedata) &&
                <Image margin='auto' src={`data:image/${item.Picturetype};base64,${item.Picturedata}`} cursor='pointer' />
              }
              {(!item.Picturetype || !item.Picturedata) &&
                <Box margin='auto' width={defaultSize} h={defaultSize} backgroundColor='gray.200' cursor='pointer'>
                  <Text paddingTop={defaultTextOffset} align='center' fontWeight='bold'>No image available</Text>
                </Box>
              }
              <Text fontSize='md' textAlign='center' textOverflow='ellipsis' overflow='hidden' cursor='pointer' isTruncated whiteSpace='pre'>
                {`${item.Title || 'No Title available'}\n`}
                {item.Artist || 'No Artist available'}
              </Text>
            </ContextMenu>
          </Box>
        );
      }}
    </FixedSizeGrid>
  );
};

export default React.memo(ItemList, (prevProps, nextProps) => {
  return (prevProps.items.length === nextProps.items.length);
});
