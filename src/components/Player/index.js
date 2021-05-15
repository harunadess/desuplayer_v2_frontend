import React, { useState, useEffect, useRef } from 'react';
import * as requests from '../../helpers/request';

const Player = () => {
	const audioRef = useRef(null);
	const lastItemRef = useRef(null);
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState({});
	const itemsIncrement = 25;
	const [numItems, setNumItems] = useState(25);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const getLibraryFile = () => {
		setIsLoading(true);
		return requests.get('library/get');
	};

	useEffect(() => {
		getLibraryFile().then(res => {
			setLibrary(res.data);
			setIsLoading(false);
		}).catch(console.error);
	}, []);

	useEffect(() => {
		const infiniteOptions = {
			root: null,
			rootMargin: '20px',
			threshold: 1.0
		};

		const lastObserver = new IntersectionObserver(handleLastObserver, infiniteOptions);
		if(lastItemRef.current)
			lastObserver.observe(lastItemRef.current);
	}, []);

	const handleLastObserver = (entries) => {
		const target = entries[0];
		if(target.isIntersecting) {
			setNumItems((currentItems) => currentItems + itemsIncrement);
		}
	};

	const buildLibrary = () => {
		setIsLoading(true);
		requests.get('library/build', { musicDir: '/mnt/d/Jorta/Music' })
		.then(res => {
			setLibrary(res.data);
			setIsLoading(false);
		}).catch(console.error);
	};

	const onClickPlayPause = () => {
		if(isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying)
		} else {
			audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	};

	const onChangeVolume = (e) => {
		audioRef.current.volume = e.target.value;
	};

	const onClickLibraryItem = (itemKey) => {
		setIsLoading(true);
		requests.get('music/get', { key: itemKey }, 'blob')
		.then(res => {
			setIsLoading(false);
			console.log(res);
			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	return (
		<>
			<span hidden={!isLoading} style={{padding: 8, margin: 16}}>-- Api Request in Progress -- </span>
			<button onClick={buildLibrary}>Build Library</button>
			<button onClick={getLibraryFile}>Get Library File</button>
			<div>
				<audio autoPlay={false} src={audioSrc} ref={audioRef} />
				<button onClick={onClickPlayPause}>Play/Pause</button>
				<input type={'range'} min={'0'} max={'1'} step={'0.02'} onChange={onChangeVolume}/>
			</div>
			<ol>
				{Object.keys(library).slice(0, numItems).map(key => {
					return (
					<li onClick={() => onClickLibraryItem(key)} key={key} style={{backgroundColor: '#eee', padding: 8, margin: 8}}>
						{Object.keys(library[key]).map(itemKey => {
							return (
							<React.Fragment key={`${key}_${itemKey}`}>
								<span>{itemKey} - {library[key][itemKey]}</span>
								<br/>
							</React.Fragment>
							);
						})}
					</li>
					);
				})}
			</ol>
			<div id={'lastRenderDiv'} ref={lastItemRef}/>
		</>
	);
};

export default Player;