import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import moment from 'moment';

import Graph from './graph.jsx';
import Song from './song.jsx';
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
      nextChartDate: null,
      currentTrackURL: null,
      nextTrackURL: null,
      oneURL: null,
      twoURL: null,
      onePlayStatus: Sound.status.PLAYING,
      twoPlayStatus: Sound.status.STOPPED,
      volOne: 25,
      volTwo: 25
    };

    this.incrementCharts = this.incrementCharts.bind(this);
    this.getDate = this.getDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setChartDate = this.setChartDate.bind(this);
    this.createInterval = this.createInterval.bind(this);
    this.songComponentOne = this.songComponentOne.bind(this);
    this.songComponentTwo = this.songComponentTwo.bind(this);
    this.toggleSoundOne = this.toggleSoundOne.bind(this);
    this.toggleSoundTwo = this.toggleSoundTwo.bind(this);
    this.handleSongFinishedPlayingOne = this.handleSongFinishedPlayingOne.bind(this);
    this.handleSongFinishedPlayingTwo = this.handleSongFinishedPlayingTwo.bind(this);
    this.handleNextSongPlayingOne = this.handleNextSongPlayingOne.bind(this);
    this.handleNextSongPlayingTwo = this.handleNextSongPlayingTwo.bind(this);
    this.isCurrentNext = this.isCurrentNext.bind(this);
    this.areBothPlaying = this.areBothPlaying.bind(this);
  }

// follow the steps
  componentDidMount() {
    console.log("mount");
    let charts;
// save the chart
    $.get('billboard-data-synced.json')
    .then(_charts => {
      charts = _charts;

      return $.get('track-meta.json');
    })
    .then(trackMetaData => {
      this.setState({
        trackMetaData: trackMetaData,
        charts: charts,
        currentDate: this.getDate(charts, 3),
        nextChartDate: this.getDate(charts, 4),
        currentTrackURL: trackMetaData[this.getDate(charts, 3)]['previewUrl'],
        nextTrackURL: trackMetaData[this.getDate(charts, 4)]['previewUrl'],
        oneURL: trackMetaData[this.getDate(charts, 3)]['previewUrl'],
        twoURL: trackMetaData[this.getDate(charts, 4)]['previewUrl']
      });

      this.currentTrack = "one";
      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 4;
    this.createInterval();
  }

  createInterval() {
    console.log("intervalStart");
    this.nextDate = setInterval(() => {
      if (this.currentTrack === "one" && this.state.currentTrackURL !== this.state.nextTrackURL) {
        console.log("increment for the case of song one current and the next track not the same ");
        this.currentTrack = "two";
        this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            onePlayStatus: Sound.status.STOPPED,
            volOne: 25,
            volTwo: 25
          });

      } else if (this.currentTrack === "two" && this.state.currentTrackURL !== this.state.nextTrackURL) {
        this.currentTrack = "one";
        this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            twoPlayStatus: Sound.status.STOPPED,
            volOne: 25,
            volTwo: 25
          });
      } else if (this.currentTrack === "one" && this.state.currentTrackURL === this.state.nextTrackURL) {
        this.currentTrack = "one";
        this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            twoPlayStatus: Sound.status.STOPPED,
            volOne: 25,
            volTwo: 25
          });
      } else if (this.currentTrack === "two" && this.state.currentTrackURL === this.state.nextTrackURL) {
        this.currentTrack = "two";
        this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            onePlayStatus: Sound.status.STOPPED,
            volOne: 25,
            volTwo: 25
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
    this.setState({
      currentDate: this.getDate(this.state.charts, this.i),
      nextChartDate: this.getDate(this.state.charts, this.i + 1),
      currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
      nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
      twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      onePlayStatus: Sound.status.PLAYING,
      twoPlayStatus: Sound.status.STOPPED,
      volOne: 25,
      volTwo: 25
    });

    this.i += 1;
    this.createInterval();
  }

  getDate(charts, index) {
    return Object.keys(charts)[index];
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  isCurrentNext(){
    return this.state.currentTrackURL === this.state.nextTrackURL;
  }

  areBothPlaying(){
    return this.state.twoPlayStatus === Sound.status.PLAYING && this.state.onePlayStatus === Sound.status.PLAYING;
  }

  handleNextSongPlayingOne() {
    console.log('handleOne');
    if (this.currentTrack === "one" && !this.isCurrentNext() && !this.areBothPlaying()) {
        this.setState({
          twoURL: this.state.nextTrackURL,
          oneURL: this.state.currentTrackURL,
          volTwo: 25,
          volOne: this.state.volOne / 4,
          twoPlayStatus: Sound.status.PLAYING
        });
      }
  }

  handleNextSongPlayingTwo() {
    console.log('handleTwo');
    if (this.currentTrack === "two" && !this.isCurrentNext() && !this.areBothPlaying()) {
        this.setState({
          oneURL: this.state.nextTrackURL,
          twoURL: this.state.currentTrackURL,
          volOne: 25,
          volTwo: this.state.volTwo / 4,
          onePlayStatus: Sound.status.PLAYING
        });
      }
  }

  handleSongFinishedPlayingOne() {
    this.setState({ oneURL: this.state.oneURL});
  }

  handleSongFinishedPlayingTwo() {
    this.setState({ twoURL: this.state.twoURL});
  }

  songComponentOne(oneURL) {
    if(oneURL){
      return <Sound playStatus={this.state.onePlayStatus}
                    volume={this.state.volOne}
                    url={this.state.oneURL}
                    onPlaying={this.handleNextSongPlayingOne}
                    onFinishedPlaying={this.handleSongFinishedPlayingOne}/>;
    }
  }

  songComponentTwo(twoURL) {
    if(twoURL){
      return <Sound playStatus={this.state.twoPlayStatus}
                    url={this.state.twoURL}
                    volume={this.state.volTwo}
                    onPlaying={this.handleNextSongPlayingTwo}
                    onFinishedPlaying={this.handleSongFinishedPlayingTwo}/>;
    }
  }

  toggleSoundOne() {
    if (this.state.onePlayStatus === Sound.status.PLAYING){
      this.setState({ playStatus: Sound.status.STOPPED });
    } else {
      this.setState({ playStatus: Sound.status.PLAYING });
    }
  }

  toggleSoundTwo() {
    if (this.state.twoPlayStatus === Sound.status.PLAYING){
      this.setState({ twoPlayStatus: Sound.status.STOPPED });
    } else {
      this.setState({ twoPlayStatus: Sound.status.PLAYING });
    }
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
      const oneURL = this.state.oneURL;
      const twoURL = this.state.twoURL;
      let toggleOne = this.state.onePlayStatus;
      let toggleTwo = this.state.twoPlayStatus;
        audioComponent =
        <div>
          {this.songComponentOne(oneURL)}
          <div onClick={this.toggleSoundOne}
               className="toggle-sound">
               {toggleOne}
          </div>
          {this.songComponentTwo(twoURL)}
          <div onClick={this.toggleSoundTwo}
               className="toggle-sound">
               {toggleTwo}
          </div>
        </div>;
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
