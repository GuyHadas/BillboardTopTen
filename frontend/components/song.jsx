import React  from 'react';
import ReactDOM from 'react-dom';
import Sound from 'react-sound';

class Song extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      playStatus: null,
      url: null
    };

  }

  toggleSound() {
    if (this.state.playStatus === Sound.status.PLAYING){
      this.setState({ playStatus: Sound.status.STOPPED });
    } else {
      this.setState({ playStatus: Sound.status.PLAYING });
    }
  }


  handleNextSongPlaying() {
    // when the component is playing
    // check the props
    // if the current track and the compnents url are the same
    // AND there is a difference in the next and current tracks
    // call on the playnextTrack callback
    if (this.props.currentTrackURL === this.state.url &&
      this.props.currentTrackURL !== this.props.nextTrackUrl) {
      this.props.playNextTrack(this.state.url);
    }
  }

  handleSongFinishedPlaying() {
    // restarts current track when sample finished playing
    this.setState({ url: this.state.url });
  }

  render(){
    let toggle = this.state.status;
    if (this.state.url) {
      return (
        <div>
          <Sound playStatus={this.props.playStatus}
                 volume={this.props.volume}
                 url={this.state.url}
                 onFinishedPlaying={this.handleSongFinishedPlaying}
                 onPlaying={this.handleNextSongPlaying}/>
          <div onClick={this.toggleSound}
               className="toggle-sound">
               {toggle}
          </div>

        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Song;