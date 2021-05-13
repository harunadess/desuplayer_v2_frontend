import React, { useState, useEffect, useRef } from 'react';
import * as requests from '../../helpers/request';
import lib from './library.json';

const Player = () => {
	const audioRef = useRef();
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

	// for testing
	useEffect(() => {
		setLibrary(lib);
	}, []);

	// note: redundant - get by key in future
	const getSingle = () => {
		requests.get('music/get', { artist: 'Alestorm', title: 'Back Through Time' }, 'blob')
		.then(res => {
			console.log(res);
			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	const getAll = () => {
		requests.get('music/getAll', { musicDir: 'D:/Users/Jorta/Music' })
		.then(res => {
			setLibrary(res.data);
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
		requests.get('music/get', { key: itemKey }, 'blob')
		.then(res => {
			console.log(res);
			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	const libraryItems = Object.keys(library).map(key => {
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
	});

	return (
		<>
			<button onClick={getSingle}>Get Single Song</button>
			<button onClick={getAll}>Get All</button>
			<div>
				<audio autoPlay={false} src={audioSrc} ref={audioRef} />
				<button onClick={onClickPlayPause}>Play/Pause</button>
				<input type={'range'} min={'0'} max={'1'} step={'0.02'} onChange={onChangeVolume}/>
			</div>
			<ol>
				{libraryItems}
			</ol>
		</>
	);
};

export default Player;