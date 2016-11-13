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
      nextChartDate: null,
      currentTrackURL: null, //current track playing
      nextTrackURL: null, //next track to be cached
      trackURLSoundComponentOne: null, //track url set on Sound component one
      trackURLSoundComponentTwo: null, //track url set on Sound component two
      soundComponentOneStatus: Sound.status.PLAYING,
      soundComponentTwoStatus: Sound.status.STOPPED,
      volOne: 100,
      volTwo: 0,
      isSoundOn: true
    };

    this.incrementCharts = this.incrementCharts.bind(this);
    this.getDate = this.getDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.setChartDate = this.setChartDate.bind(this);
    this.createInterval = this.createInterval.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
    this.handleSongFinishedPlayingOne = this.handleSongFinishedPlayingOne.bind(this);
    this.handleSongFinishedPlayingTwo = this.handleSongFinishedPlayingTwo.bind(this);
    this.isNextSongDifferent = this.isNextSongDifferent.bind(this);
    this.areBothPlaying = this.areBothPlaying.bind(this);
    this.incrementSameTrack = this.incrementSameTrack.bind(this);
    this.incrementDifferentTrack = this.incrementDifferentTrack.bind(this);
    this.fadeInFadeOut = this.fadeInFadeOut.bind(this);
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
        currentTrackURL: trackMetaData[this.getDate(charts, 0)]['previewUrl'],
        nextTrackURL: trackMetaData[this.getDate(charts, 1)]['previewUrl'],
        trackURLSoundComponentOne: trackMetaData[this.getDate(charts, 0)]['previewUrl'],
        trackURLSoundComponentTwo: trackMetaData[this.getDate(charts, 1)]['previewUrl']
      });

      this.activeSoundComponent = "one";
      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 1;
    this.createInterval();
  }

  incrementDifferentTrack() {
    let volOne = this.activeSoundComponent === "one" ? 0 : 100;
    let volTwo = this.activeSoundComponent === "one" ? 100 : 0;
    let soundComponentOneStatus = this.activeSoundComponent === "one" ? Sound.status.STOPPED : this.state.soundComponentOneStatus;
    let soundComponentTwoStatus = this.activeSoundComponent === "one" ?  this.state.soundComponentTwoStatus: Sound.status.STOPPED;
    let trackURLSoundComponentOne = this.activeSoundComponent === "one" ? this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'];
    let trackURLSoundComponentTwo = this.activeSoundComponent === "one" ? this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'];
    this.activeSoundComponent = this.activeSoundComponent === "one" ? "two" : "one";

    this.setState({
        currentDate: this.getDate(this.state.charts, this.i),
        nextChartDate: this.getDate(this.state.charts, this.i + 1),
        currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
        nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
        trackURLSoundComponentOne: trackURLSoundComponentOne,
        trackURLSoundComponentTwo: trackURLSoundComponentTwo,
        soundComponentOneStatus: soundComponentOneStatus,
        soundComponentTwoStatus: soundComponentTwoStatus,
        volOne: 0,
        volTwo: 100
      });
  }

  incrementSameTrack() {
    let volOne = this.activeSoundComponent === "one" ? 100 : 0;
    let volTwo = this.activeSoundComponent === "one" ? 0 : 100;
    let trackURLSoundComponentOne = this.activeSoundComponent === "one" ? this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'];
    let trackURLSoundComponentTwo = this.activeSoundComponent === "one" ? this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'];

    this.setState({
        currentDate: this.getDate(this.state.charts, this.i),
        nextChartDate: this.getDate(this.state.charts, this.i + 1),
        currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
        nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
        trackURLSoundComponentOne: trackURLSoundComponentOne,
        trackURLSoundComponentTwo: trackURLSoundComponentTwo,
        volOne: volOne,
        volTwo: volTwo
      });
  }

  createInterval() {
    this.nextDateInterval = setInterval(() => {
      clearInterval(this.fadeOutOneFadeInTwoInterval);
      clearInterval(this.fadeOutTwoFadeInOneInterval);
      if (this.isNextSongDifferent()) {
        this.incrementDifferentTrack();
      } else {
        this.incrementSameTrack();
      }

      this.i += 1;
      if ( this.i === Object.keys(this.state.charts).length - 2) { // Stop incrementing on second to last date
        this.i = 0;
      }
    }, 3000);
  }

  setChartDate(date) {
    this.i = Object.keys(this.state.charts).indexOf(date);
    clearInterval(this.nextDateInterval);

    if (this.fadeOutOneFadeInTwoInterval) {
      clearInterval(this.fadeOutOneFadeInTwoInterval);
    }
    if (this.fadeOutTwoFadeInOneInterval) {
      clearInterval(this.fadeOutTwoFadeInOneInterval);
    }

    if ( this.i === Object.keys(this.state.charts).length - 1) { // Last song was chosen
      this.i -= 3;
    }

    if (this.activeSoundComponent === "one") {
      this.activeSoundComponent = "two";
      this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          trackURLSoundComponentOne: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          trackURLSoundComponentTwo: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          volOne: 0,
          volTwo: 100
        });
        if(this.state.isSoundOn) {
          this.setState({
              soundComponentOneStatus: Sound.status.STOPPED,
              soundComponentTwoStatus: Sound.status.PLAYING
          });
        }
    } else {
      this.activeSoundComponent = "one";
      this.setState({
          currentDate: this.getDate(this.state.charts, this.i),
          nextChartDate: this.getDate(this.state.charts, this.i + 1),
          currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          trackURLSoundComponentOne: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
          trackURLSoundComponentTwo: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
          volOne: 100,
          volTwo: 0
        });
      if(this.state.isSoundOn) {
        this.setState({
          soundComponentOneStatus: Sound.status.PLAYING,
          soundComponentTwoStatus: Sound.status.STOPPED
        });
      }
    }

    this.i += 1;
    this.fadeInFadeOut();
    this.createInterval();
  }

  getDate(charts, index) {
    return Object.keys(charts)[index];
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  isNextSongDifferent(){
    return this.state.currentTrackURL !== this.state.nextTrackURL;
  }

  areBothPlaying() {
    return (this.state.soundComponentTwoStatus === Sound.status.PLAYING) && (this.state.soundComponentOneStatus === Sound.status.PLAYING);
  }

  fadeInFadeOut() {
    if (this.isNextSongDifferent()) {
      if (this.fadeOutOneFadeInTwoInterval) clearInterval(this.fadeOutOneFadeInTwoInterval);
      if (this.fadeOutTwoFadeInOneInterval) clearInterval(this.fadeOutTwoFadeInOneInterval);

      if (this.activeSoundComponent === 'one') {
        this.fadeOutOneFadeInTwoInterval = setInterval(() => {
          this.setState({
            volOne: this.state.volOne - 1.5,
            volTwo: this.state.volTwo + 1.5
          });
        }, (1000 / 30));
      } else {
        this.fadeOutTwoFadeInOneInterval = setInterval(() => {
          this.setState({
            volOne: this.state.volOne + 1.5,
            volTwo: this.state.volTwo - 1.5
          });
        }, (1000 / 30));
      }
    }
  }

  componentDidUpdate() {
    if ((this.isNextSongDifferent() && !this.areBothPlaying()) && this.state.isSoundOn) {
      this.fadeInFadeOut();
      if (this.activeSoundComponent === 'one') {
        this.setState({
          trackURLSoundComponentTwo: this.state.nextTrackURL,
          trackURLSoundComponentOne: this.state.currentTrackURL,
          soundComponentTwoStatus: Sound.status.PLAYING
        });
      } else {
        this.setState({
          trackURLSoundComponentOne: this.state.nextTrackURL,
          trackURLSoundComponentTwo: this.state.currentTrackURL,
          soundComponentOneStatus: Sound.status.PLAYING,
        });
      }
    }
  }

  handleSongFinishedPlayingOne() {
    this.setState({ trackURLSoundComponentOne: this.state.trackURLSoundComponentOne});
  }

  handleSongFinishedPlayingTwo() {
    this.setState({ trackURLSoundComponentTwo: this.state.trackURLSoundComponentTwo});
  }

  songComponentOne(trackURLSoundComponentOne) {
    if(trackURLSoundComponentOne){
      return <Sound playStatus={this.state.soundComponentOneStatus}
                    volume={this.state.volOne}
                    url={this.state.trackURLSoundComponentOne}
                    onFinishedPlaying={this.handleSongFinishedPlayingOne}/>;
    }
  }

  songComponentTwo(trackURLSoundComponentTwo) {
    if(trackURLSoundComponentTwo){
      return <Sound playStatus={this.state.soundComponentTwoStatus}
                    url={this.state.trackURLSoundComponentTwo}
                    volume={this.state.volTwo}
                    onFinishedPlaying={this.handleSongFinishedPlayingTwo}/>;
    }
  }

  toggleSound() {
    if (this.state.isSoundOn) {
      this.setState({
        soundComponentOneStatus: Sound.status.PAUSED,
        soundComponentTwoStatus: Sound.status.PAUSED,
        isSoundOn: false
      });
    } else {
      if (this.activeSoundComponent === 'one') {
        this.setState({
          soundComponentOneStatus: Sound.status.PLAYING,
          isSoundOn: true
        });
      } else {
        this.setState({
          soundComponentTwoStatus: Sound.status.PLAYING,
          isSoundOn: true
        });
      }
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
      const trackURLSoundComponentOne = this.state.trackURLSoundComponentOne;
      const trackURLSoundComponentTwo = this.state.trackURLSoundComponentTwo;
      let toggleOne = this.state.soundComponentOneStatus;
      let toggleTwo = this.state.soundComponentTwoStatus;
        audioComponent =
        <div>
          {this.songComponentOne(trackURLSoundComponentOne)}
          <div onClick={this.toggleSound}
               className="toggle-sound">
               {this.state.isSoundOn ? 'PLAYING' : 'MUTE'}
          </div>
          {this.songComponentTwo(trackURLSoundComponentTwo)}
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
