import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import Graph from './graph.jsx';
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
      nextChartDate: null
    };

    this.toggleSound = this.toggleSound.bind(this);
    this.incrementCharts = this.incrementCharts.bind(this);
    this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);
    this.getDate = this.getDate.bind(this);
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
    let i = 1;
    const nextDate = setInterval(() => {
      this.setState({
        currentDate: this.getDate(this.state.charts, i),
        nextChartDate: this.getDate(this.state.charts, i + 1),
        currentTrackURL: this.state.trackMetaData[this.getDate(this.state.charts, i)]['previewUrl']
      });

      i += 1;
      if ( i === Object.keys(this.state.charts).length - 2) { // Stop incrementing on second to last date
        clearInterval(nextDate);
      }
    }, 3000);
  }

  getDate(charts, index) {
    return Object.keys(charts)[index];
  }

  toggleSound() {
    this.setState({ soundPlaying: !this.state.soundPlaying });
  }

  handleSongFinishedPlaying() {
    // resets the states currentTrackURL value if the song sample is finished
    // before incrementCharts updates the currentTrackURL
    // resting the track currentTrackURL triggers a rerender and plays the
    // same song from the start
    this.setState({ currentTrackURL: this.state.currentTrackURL });
  }

  render() {
    let graphComponent;
    let audioComponent;

    if (!this.state.charts) {
      graphComponent = <div>Loading...</div>;
    } else {
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
    }
    return (
      <div>
        {graphComponent}
        {audioComponent}
      </div>
    );
  }
}

export default Home;
