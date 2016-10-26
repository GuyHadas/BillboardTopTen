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
  }

  componentDidMount() {
    let charts;

    $.get('billboard-data.json')
    .then(_charts => {
      console.log('Successfully loaded charts: ', _charts);
      charts = _charts;
      return $.get('track-meta.json');
    })
    .then(trackMetaData => {
      console.log('Successfully loaded meta data: ', trackMetaData);
      this.setState({
        trackMetaData: trackMetaData,
        charts: charts,
        currentDate: Object.keys(charts)[0],
        nextChartDate: Object.keys(charts)[1],
        currentTrackURL: trackMetaData[Object.keys(charts)[0]]['previewUrl']
      });
      this.incrementCharts();
    });
  }

  incrementCharts() {
    let i = 1;
    const nextDate = setInterval(() => {
      this.setState({
        currentDate: Object.keys(this.state.charts)[i],
        nextChartDate: Object.keys(this.state.charts)[i + 1],
        currentTrackURL: this.state.trackMetaData[Object.keys(this.state.charts)[i]]['previewUrl']
      });
      i += 1;
      if ( i === Object.keys(this.state.charts).length - 1) {
        clearInterval(nextDate);
      }
    }, 3000);
  }

  toggleSound(e) {
    e.preventDefault();
    this.setState({ soundPlaying: !this.state.soundPlaying });
  }

  render() {
    let graph;
    let audio;
    if (!this.state.charts) {
      graph = <div>Loading...</div>;
    } else {
      graph = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        nextChart={this.state.charts[this.state.nextChartDate]}
        />;
      if (this.state.currentTrackURL) {
        let volume = this.state.soundPlaying ? 100 : 0;
        let pausePlay = this.state.soundPlaying ? "Mute" : "Play";
        audio =
         <div>
           <Sound playStatus={Sound.status.PLAYING} volume={volume} url={this.state.currentTrackURL}/>
           <div onClick={this.toggleSound} className="toggle-sound">{pausePlay}</div>
         </div>;
      }
    }
    return (
      <div>
        {graph}
        {audio}
      </div>
    );
  }
}

export default Home;
