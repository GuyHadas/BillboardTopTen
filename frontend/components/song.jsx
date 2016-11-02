import React  from 'react';
import ReactDOM from 'react-dom';
import Sound from 'react-sound';

class Song extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      soundPlaying: true
    };
    this.toggleSound = this.toggleSound.bind(this);
    this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);
  }

  toggleSound() {
    this.setState({ soundPlaying: !this.state.soundPlaying });
  }

  handleSongFinishedPlaying() {
    // restarts current track when sample finished playing
    this.setState({ currentTrackURL: this.state.currentTrackURL });
  }

  render(){
    let pausePlay = this.state.soundPlaying ? 'Mute' : 'Play';
    return (
      <div>
        <Sound playStatus={Sound.status.PLAYING}
               volume={this.props.volume}
               url={this.props.url}
               onPlaying={this.handleCurrentSongPlaying}/>
        <div onClick={this.toggleSound}
             className="toggle-sound">
             {pausePlay}
        </div>

      </div>
    );
  }
}

export default Song;
