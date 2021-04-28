import './App.css';
import {Main} from './components/main';
import * as playerBits from './components/playerBits';

function App() {
  return (
    <div className="App">
      <Main/>
      <playerBits.NextButton/>
      <playerBits.PauseButton/>
      <playerBits.PlayButton/>
      <playerBits.Player/>
      <playerBits.PreviousButton/>
      <playerBits.TrackSeek/>
      <playerBits.VolumeAdjust/>
    </div>
  );
}

export default App;

/*
  So, what do we need for a music player frontend?

  - list of songs/albums/etc depending on how you want to organise it
  - album art?
  - rendering of saved playlists
  - player interface (nice buttons/sliders?)
  - search
  - persistence of data (don't want to refresh unless you ask it to)


  - components
    - Main? Layout
    - Track/Album list (search)
    - Player/Controls
      - Play/Pause, Stop, Previous, Next, Volume
      - Currently playing
    - Queue (of what is playing/going to play)
    - Playlist

  is it worth doing?
  maybe.
*/