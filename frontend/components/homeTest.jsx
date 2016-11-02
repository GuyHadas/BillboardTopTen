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

    this.nextTrackPosition = 0;
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

    this.incrementCharts = this.incrementCharts.bind(this);
    this.getDate = this.getDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setChartDate = this.setChartDate.bind(this);
    this.createInterval = this.createInterval.bind(this);
    this.soundComponent = this.soundComponent.bind(this);
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
        volumeCurrentTrack: 25,
        volumeNextTrack: 25,
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
          volumeCurrentTrack: 25,
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          nextTrackPlayStatus: Sound.status.STOPPED,
          nextTrackPosition: this.nextTrackPosition
        });
        this.nextTrackPosition = undefined;
      } else {
        this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          volumeCurrentTrack: 25,
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl']
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

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  soundComponent(url, volume) {
    return <Song url={url}
                 volume={volume}
                 />;
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
      const currentTrackURL = this.state.currentTrackURL;
      const nextTrackURL = this.state.nextTrackURL;
      if (currentTrackURL) {
        this.volumeCurrentTracks = this.state.soundPlaying ? 25 : 0;
          audioComponent =
           <div>
           {this.soundComponent(currentTrackURL, this.volumeCurrentTracks)}
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
