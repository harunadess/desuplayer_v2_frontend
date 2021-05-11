import React, { useState, useEffect, useRef } from 'react';
import * as requests from '../../helpers/request';

const Player = () => {
	const audioRef = useRef();
	const [audioSrc, setAudioSrc] = useState('');
	const [library, setLibrary] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

	const getSingle = () => {
		requests.get('music/get', { artist: 'Alestorm', title: 'Back Through Time' }, 'blob')
		.then(res => {
			console.log(res);

			const format = res.headers['content-type'];
			const track = new Blob([res.data], { type: format });
			console.log(format, track);
			const trackURL = window.URL.createObjectURL(track);
			console.log(trackURL);
			setAudioSrc(trackURL);
		}).catch(console.error);
	};

	const getAll = () => {
		requests.get('music/getAll', { musicDir: 'D:/Users/Jorta/Music' })
		.then(res => {
			console.log(res);
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
		console.log(e.target.value);
		audioRef.current.volume = e.target.value;
	};

	return (
		<>
			<button onClick={getSingle}>Get Single Song</button>
			<button onClick={getAll}>Get All</button>
			<div>
				<audio autoPlay={false} src={audioSrc} ref={audioRef} />
				<button onClick={onClickPlayPause}>Play/Pause</button>
				<input type={'range'} min={'0'} max={'1'} step={'0.02'} onChange={onChangeVolume}/>
			</div>
		</>
	);
};

export default Player;