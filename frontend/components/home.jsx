import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import moment from 'moment';

import Graph from './graph.jsx';
import { Title } from './title.jsx';
import DatePicker from './datePicker.jsx';
import Sound from 'react-sound';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
      trackMetaData: null,
      currentDate: null,
      currentTrackURL: null,
      soundPlaying: true,
      nextChartDate: null,
      volumeCurrentTrack: 0,
      volumeNextTrack: 0,
      nextTrackPlayStatus: Sound.status.STOPPED,
      nextTrackPosition: 0
    };
    // this.volumeCurrentTrack = 100;
    this.toggleSound = this.toggleSound.bind(this);
    this.incrementCharts = this.incrementCharts.bind(this);
    this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);
    this.getDate = this.getDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setChartDate = this.setChartDate.bind(this);
    this.createInterval = this.createInterval.bind(this);
    this.handleCurrentSongPlaying = this.handleCurrentSongPlaying.bind(this);
    this.handleNextSongPlaying = this.handleNextSongPlaying.bind(this);
    this.currentSoundComponent = this.currentSoundComponent.bind(this);
    this.nextSoundComponent = this.nextSoundComponent.bind(this);
  }

  componentDidMount() {
    let charts;

    $.get('billboard-data-synced.json')
    .then(_charts => {
      charts = _charts;

      return $.get('track-meta.json');
    })
    .then(trackMetaData => {
      this.setState({
        trackMetaData: trackMetaData,
        charts: charts,
        currentDate: this.getDate(charts, 4),
        nextChartDate: this.getDate(charts, 5),
        currentTrackURL: trackMetaData[this.getDate(charts, 4)]['previewUrl'],
        nextTrackURL: trackMetaData[this.getDate(charts, 5)]['previewUrl'],
        volumeCurrentTrack: 100,
        volumeNextTrack: 100,
      });

      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 5;
    this.createInterval();
  }

  createInterval() {
    this.nextDate = setInterval(() => {
      if(this.state.nextTrackURL !== this.state.currentTrackURL){
        this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          volumeCurrentTrack: 100,
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          nextTrackPlayStatus: Sound.status.STOPPED,
          nextTrackPosition: this.nextTrackPosition
        });
      } else {
        this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          volumeCurrentTrack: 100,
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          nextTrackPlayStatus: Sound.status.STOPPED,
          nextTrackPosition: 0
        });
      }
      this.i += 1;
      if ( this.i === Object.keys(this.state.charts).length - 2) { // Stop incrementing on second to last date
        clearInterval(this.nextDate);
      }
    }, 3000);
  }

  setChartDate(date) {
    this.i = Object.keys(this.state.charts).indexOf(date);
    clearInterval(this.nextDate);
    if (this.state.nextTrackPlayStatus === Sound.status.PLAYING){
      this.setState({
        currentDate: this.getDate(this.state.charts, this.i),
        nextChartDate: this.getDate(this.state.charts, this.i + 1),
        currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
        nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
        nextTrackPlayStatus: Sound.status.STOPPED
      });
    }
    this.i += 1;
    this.createInterval();
  }

  getDate(charts, index) {
    return Object.keys(charts)[index];
  }

  toggleSound() {
    this.setState({ soundPlaying: !this.state.soundPlaying });
  }

  handleSongFinishedPlaying() {
    // restarts current track when sample finished playing
    this.setState({ currentTrackURL: this.state.currentTrackURL });
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  handleCurrentSongPlaying(args) {
    if(this.state.currentTrackURL !== this.state.nextTrackURL){
      this.nextTrackPosition = 0;
      setInterval(() => {this.nextTrackPosition += 1;}, 0.1);
      this.setState({ volumeCurrentTrack: this.state.volumeCurrentTrack/4,
                      nextTrackPlayStatus: Sound.status.PLAYING
                    });
      // setInterval(() => {this.volumeCurrentTrack -= 1;}, 100);
    }
  }

  handleNextSongPlaying(args){
    // console.log(args.position);
    // this.setState({ nextTrackPosition: args.position });
  }

  currentSoundComponent(){
    if (this.state.nextTrackPosition) {
      return (
        <Sound playStatus={Sound.status.PLAYING}
        volume={this.state.volumeCurrentTrack}
        url={this.state.currentTrackURL}
        onPlaying={this.handleCurrentSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
        playFromPosition={this.state.nextTrackPosition}/>
      );
    } else {
      return (
        <Sound playStatus={Sound.status.PLAYING}
        volume={this.state.volumeCurrentTrack}
        url={this.state.currentTrackURL}
        onPlaying={this.handleCurrentSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}/>
      );
    }
  }

  nextSoundComponent(){
    return (
      <Sound playStatus={this.state.nextTrackPlayStatus}
             volume={this.state.volumeNextTrack}
             url={this.state.nextTrackURL}
             onFinishedPlaying={this.handleNextSongPlaying}/>
    );
  }

  render() {
    let graphComponent;
    let audioComponent;
    let datePickerComponent;
    let titleBoxComponent;
    if (!this.state.charts) {
      graphComponent = <div>Loading...</div>;
    } else {
      titleBoxComponent = <Title
        date={this.formatDate(this.state.currentDate)}
        artist={this.state.charts[this.state.currentDate][0].artist}
        />;

      graphComponent = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        nextChart={this.state.charts[this.state.nextChartDate]}
        />;

      if (this.state.currentTrackURL) {
        this.volumeCurrentTracks = this.state.soundPlaying ? 100 : 0;
          let pausePlay = this.state.soundPlaying ? 'Mute' : 'Play';
          audioComponent =
           <div>
           {this.currentSoundComponent()}
           {this.nextSoundComponent()}
             <div onClick={this.toggleSound}
                  className="toggle-sound">
                  {pausePlay}
              </div>
           </div>;
      }
      datePickerComponent = <DatePicker charts={this.state.charts} setChartDate={this.setChartDate.bind(this)}/>;

    }
    return (
      <div>
        {titleBoxComponent}
        <section id="mainContainer">
          {datePickerComponent}
          {graphComponent}
        </section>
        <div id="stagingArea"/>
        {audioComponent}
      </div>
    );
  }
}

export default Home;
