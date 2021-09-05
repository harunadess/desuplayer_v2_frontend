import React, { useState, useRef, useEffect } from 'react';
import { Box, Center, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import propTypes from 'prop-types';


/* 
	A failed experiment that I may come back to at some point
	but for now, react-window seems to suit our purposes well enough
 */
const LazyLoadImage = (props) => {
	const elemRef = useRef(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		console.log(elemRef.current.parentElement.parentElement.parentElement);
		const box = elemRef.current?.getBoundingClientRect();
		const parent = elemRef.current.parentElement.parentElement.parentElement;
		console.log('box', box);
		if(!box) return false;

		console.log(
			'inView',
			box.top >= 0,
			box.bottom <= window.innerHeight
		);

		setInView(
			box.top >= 0 &&
			box.bottom <= window.innerHeight
		);
	}, [elemRef, window.innerHeight, window.innerWidth]);

	if(inView) {
		return (
			<Image ref={elemRef} {...props} />
		);
	}

	return (
		<Box ref={elemRef} margin={'auto'} width={'200px'} h={'200px'} backgroundColor={'gray.200'}>
			<Center>
				<Text margin={'auto'} fontWeight={'bold'}>Loading...</Text>
			</Center>
		</Box>
	);
};

LazyLoadImage.propTypes = {
	...Image.props
};

export default LazyLoadImage;