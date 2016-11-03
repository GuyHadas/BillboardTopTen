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
      nextChartDate: null,
      currentTrackURL: null,
      nextTrackUrl: null,
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
  }
// follow the steps
  componentDidMount() {
    let charts;
// save the chart
    $.get('billboard-data-synced.json')
    .then(_charts => {
      charts = _charts;

      return $.get('track-meta.json');
    })
    .then(trackMetaData => {
      // set the currentDate, nextdate
      // set the track urls for current and next
      // set songone to current and two to next
      this.setState({
        trackMetaData: trackMetaData,
        charts: charts,
        currentDate: this.getDate(charts, 4),
        nextChartDate: this.getDate(charts, 5),
        currentTrackURL: trackMetaData[this.getDate(charts, 4)]['previewUrl'],
        nextTrackUrl: trackMetaData[this.getDate(charts, 5)]['previewUrl'],
        oneURL: trackMetaData[this.getDate(charts, 4)]['previewUrl'],
        twoURL: trackMetaData[this.getDate(charts, 5)]['previewUrl'],
      });

      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 5;
    this.createInterval();
  }

  oneIsCurrent(){
    this.setStat({
      volOne: this.state.voleOne / 4,
      twoPlayStatus: Sound.status.PLAYING
    });
    // this is only called when one is the current track
    // and two is set to the next track
    // when the incrementing happens the first song should
    // stop while the second song should keep playing
    this.stopOne = true;
  }

  twoIsCurrent(){
    this.setStat({
      volOne: this.state.voleOne / 4,
      twoPlayStatus: Sound.status.PLAYING
    });
    // the logic for when the second song is the current song
    // and the next track is the playing on the one
    // at the interval the songComponentTwo should
    // stop playing and the songCompnentOne should start
    this.stopTwo = true;
  }

  createInterval() {
    this.nextDate = setInterval(() => {
      if (this.stopOne) {
        // stop the first track since it was the old track
        // keep the second track
        // set one to the next track
        this.stopOne = false;
        this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          onePlayStatus: Sound.status.STOPPED,
        });
      } else if (this.stopTwo) {
        this.stopTwo = false;
        this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          twoPlayStatus: Sound.status.STOPPED,
        });
        // this is the case where both stopOne and stopTwo
        // are false
        // this means that for this case current track
        // is the same as the next track from the previous
        // increment
        // so find which component is the current component
        // and increment it to this.i
        // while for the other increment is to this.i + 1
      } else if ( !this.stopTwo && !this.stopOne) {
        if (this.state.currentTrackURL === this.state.oneURL){
          // if the current track is the song
          // playing in songCompnentOne
          // AND the next track is going to be the same as the current
          // increment the One and set Two to the next increment
          this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl']
          });
        } else {
          this.setState({
            currentDate: this.getDate(this.state.charts, this.i),
            nextChartDate: this.getDate(this.state.charts, this.i + 1),
            currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
            nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
            twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl']
          });
        }
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
      nextTrackUrl: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      oneURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
      twoURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      twoPlayStatus: Sound.status.STOPPED
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

  songComponentOne(url, status, volOne) {
    // set up the sound components with the
    // the necessary props
    // here the url sound status vol
    // current track next track
    // and the callback to handle the next song are
    // passed in
    return <Song url={url}
                 playStatus={status}
                 volume={volOne}
                 currentTrackURL={this.state.currentTrackURL}
                 nextTrackURL={this.state.nextTrackURL}
                 playNextTrack={this.playNextTrack}/>;
  }

  songComponentTwo(url, status, volTwo) {
    return <Song url={url}
                 playStatus={status}
                 volume={volTwo}
                 currentTrackURL={this.state.currentTrackURL}
                 nextTrackURL={this.state.nextTrackURL}
                 playNextTrack={this.playNextTrack}/>;
  }

  playNextTrack(url) {
    // this is a callback passed in as a prop to the
    // song components
    if (url === this.state.oneURL) {
      // maybe change the name of the method
      // if the url passed from the song comp
      // is the same as the the first song's
      // url then call on the oneIsCurrent method
      // the result is to play the next track in
      // songtwo
      this.oneIsCurrent();
    } else {
      // this is for the case when the second song is the
      // going to be the current track
      // the result is to play the next track on song comp one
      this.twoIsCurrent();
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
      // if there is a url then render both of the
      // sound components
      // in the constructor the state is set such that
      // the One is playing and Two is STOPPED
      if (oneURL) {
        audioComponent =
        <div>
          {this.songComponentOne(oneURL, this.state.onePlayStatus, this.state.volOne)}
          {this.songComponentTwo(twoURL, this.state.twoPlayStatus, this.state.volTwo)}
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
