import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import moment from 'moment';

import Graph from './graph.jsx';
import { Title } from './title.jsx';
import DatePicker from './datePicker.jsx';
import Sound from 'react-sound';
import Chart from './chart.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
      trackMetaData: null,
      currentDate: null,
      currentTrackURL: null,
      soundPlaying: false,
      nextChartDate: null
    };

    this.toggleSound = this.toggleSound.bind(this);
    this.incrementCharts = this.incrementCharts.bind(this);
    this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);
    this.getDate = this.getDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setChartDate = this.setChartDate.bind(this);
    this.createInterval = this.createInterval.bind(this);
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
        currentDate: this.getDate(charts, 0),
        nextChartDate: this.getDate(charts, 1),
        currentTrackURL: trackMetaData[this.getDate(charts, 0)]['previewUrl']
      });

      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 1;
    this.createInterval();
  }

  createInterval() {
    this.nextDate = setInterval(() => {
      this.setState({
        currentDate: this.getDate(this.state.charts, this.i),
        nextChartDate: this.getDate(this.state.charts, this.i + 1),
        currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl']
      });

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
      currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl']
    });
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
    // resets the states currentTrackURL value if the song sample is finished
    this.setState({ currentTrackURL: this.state.currentTrackURL });
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  render() {
    let graphComponent;
    let audioComponent;
    let datePickerComponent;
    let titleBoxComponent;
    let chartComponent;

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
        let volume = this.state.soundPlaying ? 100 : 0;
        let pausePlay = this.state.soundPlaying ? 'Mute' : 'Play';

        audioComponent =
         <div>
           <Sound playStatus={Sound.status.PLAYING}
                  volume={volume}
                  url={this.state.currentTrackURL}
                  onFinishedPlaying={this.handleSongFinishedPlaying}/>
           <div onClick={this.toggleSound}
                className="toggle-sound">
                {pausePlay}
            </div>
         </div>;
      }
      datePickerComponent = <DatePicker charts={this.state.charts} setChartDate={this.setChartDate.bind(this)}/>;
      chartComponent = <Chart chart={this.state.charts[this.state.currentDate]} nextChart={this.state.charts[this.state.nextChartDate]}/>;
    }
    return (
      <div>
        {titleBoxComponent}
        <section id="mainContainer">
          {datePickerComponent}
          {chartComponent}
          {graphComponent}
        </section>
        <div id="stagingArea"/>
        {audioComponent}
      </div>
    );
  }
}

export default Home;
