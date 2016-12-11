import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import moment from 'moment';
import StringHash from 'string-hash';

import Graph from './graph.jsx';
import Title from './title.jsx';
import Sound from 'react-sound';
import Chart from './chart.jsx';
import Tabs from './tabs.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albumImages: null,
      charts: null,
      trackMetaData: null,
      lastChartDate: null,
      twoWeeksBackChartDate: null,
      threeWeeksBackChartDate: null,
      fourWeeksBackChartDate: null,
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
      isSoundOn: true,
      genre: 'hot100'
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
    this.stopInterval = this.stopInterval.bind(this);
    this.startCharts = this.startCharts.bind(this);
    this.playGenre = this.playGenre.bind(this);
  }

  componentDidMount() {
    this.activeSoundComponent = 'one';
    this.startCharts(this.state.genre);
  }

  startCharts(genre) {
    let charts, albumImages;

    $.get(`charts/${genre}/charts.json`)
    .then(_charts => {
      charts = _charts;

      return $.get(`charts/${genre}/images.json`);
    })
    .then(_albumImages => {
      albumImages = _albumImages;

      return $.get(`charts/${genre}/previewUrls.json`);
    })
    .then(trackMetaData => {
      this.i = 0;

      this.setState({
        trackMetaData: trackMetaData,
        albumImages: albumImages,
        charts: charts,
        fourWeeksBackChartDate: this.getDate(charts, this.i - 4),
        threeWeeksBackChartDate: this.getDate(charts, this.i - 3),
        twoWeeksBackChartDate: this.getDate(charts, this.i - 2),
        lastChartDate: this.getDate(charts, this.i - 1),
        currentDate: this.getDate(charts, this.i),
        nextChartDate: this.getDate(charts, this.i + 1),
        currentTrackURL: trackMetaData[this.getDate(charts, this.i)]['previewUrl'],
        nextTrackURL: trackMetaData[this.getDate(charts, this.i + 1)]['previewUrl']
      });

      if (trackMetaData[this.getDate(charts, 0)]['previewUrl'] !== trackMetaData[this.getDate(charts, 1)]['previewUrl']) {
        this.incrementDifferentTrack();
      } else {
        this.incrementSameTrack();
      }

      this.incrementCharts();
    });
  }

  incrementCharts() {
    this.i = 1;
    this.createInterval();
  }

  incrementDifferentTrack() {
    let volOne = this.activeSoundComponent === 'one' ? 0 : 100;
    let volTwo = this.activeSoundComponent === 'one' ? 100 : 0;
    let soundComponentOneStatus;
    let soundComponentTwoStatus;
    if(this.state.isSoundOn){
      soundComponentOneStatus = this.activeSoundComponent === 'one' ? Sound.status.STOPPED : Sound.status.PLAYING;
      soundComponentTwoStatus = this.activeSoundComponent === 'one' ?  Sound.status.PLAYING : Sound.status.STOPPED;
    } else {
      soundComponentOneStatus = this.activeSoundComponent === 'one' ? Sound.status.STOPPED : this.state.soundComponentOneStatus;
      soundComponentTwoStatus = this.activeSoundComponent === 'one' ?  this.state.soundComponentTwoStatus : Sound.status.STOPPED;
    }
    let trackURLSoundComponentOne = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'];
    let trackURLSoundComponentTwo = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'];
    this.activeSoundComponent = this.activeSoundComponent === 'one' ? 'two' : 'one';

    this.setState({
      fourWeeksBackChartDate: this.getDate(this.state.charts, this.i - 4),
      threeWeeksBackChartDate: this.getDate(this.state.charts, this.i - 3),
      twoWeeksBackChartDate: this.getDate(this.state.charts, this.i - 2),
      lastChartDate: this.getDate(this.state.charts, this.i - 1),
      currentDate: this.getDate(this.state.charts, this.i),
      nextChartDate: this.getDate(this.state.charts, this.i + 1),
      currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
      nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      trackURLSoundComponentOne: trackURLSoundComponentOne,
      trackURLSoundComponentTwo: trackURLSoundComponentTwo,
      soundComponentOneStatus: soundComponentOneStatus,
      soundComponentTwoStatus: soundComponentTwoStatus,
      volOne: volOne,
      volTwo: volTwo
    });
  }

  incrementSameTrack() {
    let volOne = this.activeSoundComponent === 'one' ? 100 : 0;
    let volTwo = this.activeSoundComponent === 'one' ? 0 : 100;
    let trackURLSoundComponentOne = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'];
    let trackURLSoundComponentTwo = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'];

    this.setState({
      fourWeeksBackChartDate: this.getDate(this.state.charts, this.i - 4),
      threeWeeksBackChartDate: this.getDate(this.state.charts, this.i - 3),
      twoWeeksBackChartDate: this.getDate(this.state.charts, this.i - 2),
      lastChartDate: this.getDate(this.state.charts, this.i - 1),
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
    if (this.nextDateInterval) {
      clearInterval(this.nextDateInterval);
    }
    this.nextDateInterval = setInterval(() => {
      clearInterval(this.fadeOutOneFadeInTwoInterval);
      clearInterval(this.fadeOutTwoFadeInOneInterval);
      if (this.isNextSongDifferent()) {
        this.incrementDifferentTrack();
      } else {
        this.incrementSameTrack();
      }

      this.i += 1;
      if ( this.i >= Object.keys(this.state.charts).length - 2) { // Stop incrementing on second to last date
        this.i = 0;
      }
    }, 3000);
  }

  setChartDate(date) {
    this.i = Object.keys(this.state.charts).indexOf(date);
    if (this.nextDateInterval) clearInterval(this.nextDateInterval);
    if (this.fadeOutOneFadeInTwoInterval) clearInterval(this.fadeOutOneFadeInTwoInterval);
    if (this.fadeOutTwoFadeInOneInterval) clearInterval(this.fadeOutTwoFadeInOneInterval);

    if ( this.i === Object.keys(this.state.charts).length - 1) { // Last song was chosen
      this.i -= 3;
    }

    if (this.state.isSoundOn) {
      this.setState({
        soundComponentOneStatus: this.activeSoundComponent === 'one' ? Sound.status.STOPPED : Sound.status.PLAYING,
        soundComponentTwoStatus: this.activeSoundComponent === 'one' ? Sound.status.PLAYING : Sound.status.STOPPED
      });
    }

    let volOne = this.activeSoundComponent === 'one' ? 0 : 100;
    let volTwo = this.activeSoundComponent === 'one' ? 100 : 0;
    let trackURLSoundComponentOne = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'];
    let trackURLSoundComponentTwo = this.activeSoundComponent === 'one' ? this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'] :
                                              this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'];

    this.activeSoundComponent = this.activeSoundComponent === 'one' ? 'two' : 'one';

    this.setState({
      fourWeeksBackChartDate: this.getDate(this.state.charts, this.i - 4),
      threeWeeksBackChartDate: this.getDate(this.state.charts, this.i - 3),
      twoWeeksBackChartDate: this.getDate(this.state.charts, this.i - 2),
      lastChartDate: this.getDate(this.state.charts, this.i - 1),
      currentDate: this.getDate(this.state.charts, this.i),
      nextChartDate: this.getDate(this.state.charts, this.i + 1),
      currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i)]['previewUrl'],
      nextTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, this.i + 1)]['previewUrl'],
      trackURLSoundComponentOne: trackURLSoundComponentOne,
      trackURLSoundComponentTwo: trackURLSoundComponentTwo,
      volOne: volOne,
      volTwo: volTwo
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
      let trackURLSoundComponentOne = this.activeSoundComponent === 'one' ? this.state.currentTrackURL : this.state.nextTrackURL;
      let trackURLSoundComponentTwo = this.activeSoundComponent === 'one' ? this.state.nextTrackURL : this.state.currentTrackURL;

      this.setState({
        trackURLSoundComponentOne: trackURLSoundComponentOne,
        trackURLSoundComponentTwo: trackURLSoundComponentTwo,
        soundComponentOneStatus: Sound.status.PLAYING,
        soundComponentTwoStatus: Sound.status.PLAYING
      });
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

  getColorForTitle(trackTitle) {
    let hash = StringHash(trackTitle);

    let colors = [
      '#FEF59E', // yellow
      '#98CC9F', // lime green
      '#998AC0', // dark purple
      '#8AD2F4', // turquoise
      '#F4B589', // red orange
      '#C897C0', // light purple
      '#FFB347', // orange
      '#B1E2DA', // teal
      '#FF6961', // red
      '#779ECB', // navy blue
      '#DEA5A4', // light red
      '#CBFFCB',  // light green
    ];

    return colors[hash % colors.length];
  }

  stopInterval() {
    clearInterval(this.nextDateInterval);
  }

  playGenre(genre) {
    if (genre !== this.state.genre) {
      this.setState({ genre: genre });
      this.startCharts(genre);
    }
  }

  render() {
    let graphComponent;
    let audioComponent;
    let datePickerComponent;
    let titleBoxComponent;
    let chartComponent;
    let tabsComponent;

    if (!this.state.charts || !this.state.currentTrackURL) {
      graphComponent = <div>Loading...</div>;
    } else {
      titleBoxComponent = <Title
        date={this.formatDate(this.state.currentDate)}
        artist={this.state.charts[this.state.currentDate][0].artist}
        toggleSound={this.toggleSound}
        isSoundOn={this.state.isSoundOn}
        genre={this.state.genre}
        />;

      graphComponent = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        nextChart={this.state.charts[this.state.nextChartDate]}
        albumImages={this.state.albumImages}
        getColorForTitle={this.getColorForTitle}
        />;
      const trackURLSoundComponentOne = this.state.trackURLSoundComponentOne;
      const trackURLSoundComponentTwo = this.state.trackURLSoundComponentTwo;

      audioComponent =
        <div>
          {this.songComponentOne(trackURLSoundComponentOne)}
          {this.songComponentTwo(trackURLSoundComponentTwo)}
        </div>;

      tabsComponent = <Tabs
        charts={this.state.charts}
        setChartDate={this.setChartDate.bind(this)}
        currentDate={this.state.currentDate}
        playGenre={this.playGenre}/>;

      chartComponent = <Chart
        chart={this.state.charts[this.state.currentDate]}
        nextChart={this.state.charts[this.state.nextChartDate]}
        prevChart={this.state.charts[this.state.lastChartDate]}
        twoWeeksBackChart={this.state.charts[this.state.twoWeeksBackChartDate]}
        threeWeeksBackChart={this.state.charts[this.state.threeWeeksBackChartDate]}
        fourWeeksBackChart={this.state.charts[this.state.fourWeeksBackChartDate]}
        getColorForTitle={this.getColorForTitle}
        currentDate={this.state.currentDate}
        nextChartDate={this.state.nextChartDate}
        prevChartDate={this.state.lastChartDate}
        twoWeeksBackChartDate={this.state.twoWeeksBackChartDate}
        threeWeeksBackChartDate={this.state.threeWeeksBackChartDate}
        fourWeeksBackChartDate={this.state.fourWeeksBackChartDate}
        />;
    }
    return (
      <div>
        {titleBoxComponent}
        <section id='mainContainer'>
          {tabsComponent}
          {chartComponent}
          {graphComponent}
        </section>
        {audioComponent}
      </div>
    );
  }
}

export default Home;
