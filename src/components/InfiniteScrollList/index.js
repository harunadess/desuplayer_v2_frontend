import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Box } from '@chakra-ui/layout';

const InfiniteScrollList = (props) => {
  const bottomOfListRef = useRef(null);
  const { children, onInfiniteScrollBottom } = props;

  useEffect(() => {
    const options = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleIntersection, options);
    if (bottomOfListRef.current)
      observer.observe(bottomOfListRef.current);
  }, []);

  const handleIntersection = (entries) => {
    const target = entries[0];
    if (target.isIntersecting)
      onInfiniteScrollBottom();
  };

  return (
    <Box
      w={'100%'} h={'100%'}
    >
      <Box>
        {children}
        <Box id={'bottomOfList'} h={10} ref={bottomOfListRef} />
      </Box>
    </Box>
  );
};

InfiniteScrollList.propTypes = {
  children: propTypes.node.isRequired,
  onInfiniteScrollBottom: propTypes.func.isRequired
};

export default InfiniteScrollList;
