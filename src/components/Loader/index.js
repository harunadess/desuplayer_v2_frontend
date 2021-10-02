import React from 'react';
import { Box, Center, SimpleGrid } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Skeleton } from '@chakra-ui/skeleton';

const Loader = (props) => {
  const { spinner } = props;

  const boxSize = 225;
  const defaultSize = 200;
  const defaultTextOffset = 84;
  const extraPad = 32;
  const columnCount = 7;
  const gap = 5;

  const skeletonGenerator = () => {
    const cols = [];
    for(let i = 0; i < columnCount*(columnCount-2); i++)
      cols.push(i);

    return cols.map((_, i) => {
      return (
        <Skeleton key={`skelly_loader_${i}`} w={`${boxSize}px`} h={`${boxSize}px`} />
      );
    });
  };

  if(spinner) {
    return (
      <Center w='100vw' h='90vh'> 
        <Spinner thickness='5px' speed='0.65s' emptyColor='gray.200' color="blue.400" size="xl" margin='auto' />
      </Center>
    );
  }

  return (
    <Box maxH='90vh' overflow='hidden' marginLeft='3%'>
      <SimpleGrid columns={columnCount} columnGap={gap + gap} rowGap={gap} padding='4'>
        {skeletonGenerator()}
      </SimpleGrid>
    </Box>
  );
};

export default Loader;