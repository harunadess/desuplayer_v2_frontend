import { Grid, GridItem } from '@chakra-ui/layout';
import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Box } from '@chakra-ui/layout';

const ItemList = (props) => {
    const bottomOfListRef = useRef(null);
    const {
        className,
        displayKeys,
        infiniteScroll,
        items,
        itemKey,
        listType,
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

    const renderDefaultList = () => {
        return (
            <Grid
                gap={6}
                maxH={'80vh'}
                overflowY={'auto'}
                templateColumns={'repeat(3, 1fr)'}
            >
                {items.map(item => {
                    return (
                        <GridItem backgroundColor={'blueviolet'} key={item[itemKey]} onClick={() => onClickItem(item[itemKey])}>
                            {displayKeys.map(innerKey => {
                                return (
                                <React.Fragment key={`${item[itemKey]}_${innerKey}`}>
                                    <span>{innerKey} - {item[innerKey]}</span>
                                    <br/>
                                </React.Fragment>
							);
						})}
                        </GridItem>
                    );
                })}
                {infiniteScroll && <Box id={'bottomOfList'} h={40} ref={bottomOfListRef}/>}
            </Grid>
        );
    };

    switch(listType) {
        default:
            return renderDefaultList();
    }
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
