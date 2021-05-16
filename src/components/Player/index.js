import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { IconButton } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/slider';
import { MdGraphicEq, MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import { Grid, GridItem } from '@chakra-ui/layout';
import { Center } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { ButtonGroup } from '@chakra-ui/button';

const Player = (props) => {
	const { currentlyPlaying, source } = props;
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const onClickPlayPause = () => {
		if(isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying)
		} else {
			audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	};

	const onChangeVolume = (value) => {
		audioRef.current.volume = value;
	};

	return (
		<div>
			<audio autoPlay={false} src={source} ref={audioRef} />
			<Grid
				gap={2}
				templateColumns={'repeat(12, 1fr)'}
			>
				<GridItem colSpan={1}>
					<ButtonGroup size={'sm'}>
						<IconButton
							icon={<MdSkipPrevious/>}
							onClick={() => console.log('previous')}
						/>
						<IconButton
							icon={isPlaying ? <MdPause/> : <MdPlayArrow/>}
							onClick={onClickPlayPause}
						/>
						<IconButton
							icon={<MdSkipNext/>}
							onClick={() => console.log('next')}
						/>
					</ButtonGroup>
				</GridItem>
				<GridItem colSpan={2}>
					<Center height={'100%'} width={'100%'}>
						<Slider
							min={0}
							max={1}
							onChange={onChangeVolume}
							step={0.01}
						>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb color={'gray'}>
								<Box color={'black'} as={MdGraphicEq}/>
							</SliderThumb>
						</Slider>
					</Center>
				</GridItem>
				<GridItem colSpan={3}>
					{currentlyPlaying?.Key &&
						<Box>
							<Text fontSize={'small'} >{currentlyPlaying.Title}</Text>
							<Text fontSize={'small'}>{currentlyPlaying.Artist} - {currentlyPlaying.Album}</Text>
						</Box> 
					}
				</GridItem>
			</Grid>
		</div>
	);
};

Player.propTypes = {
	currentlyPlaying: propTypes.object.isRequired,
	source: propTypes.string
};

export default Player;