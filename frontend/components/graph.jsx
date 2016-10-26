import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import Track from './track.jsx';
import { Title } from './title.jsx';

class Graph extends React.Component{
  constructor(props){
    super(props);
    this.toDate = this.toDate.bind(this);
  }

  toDate(date) {
    const months = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      "09": 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    };

    return `${months[date.slice(5, 7)]} ${date.substring(8, 10)}, ${date.substring(0, 4)}`;
  }

  render() {
    const date = this.toDate(this.props.date);

    const nextChartNames = this.props.nextChart.map(trackOnDeck => trackOnDeck.title);
    const tracks = this.props.chart.map(track => {
      let nextTrackRank = nextChartNames.indexOf(track.title) + 1; // index 0 should be rank 1, etc...
      if (nextTrackRank === 0) {
        nextTrackRank = 13; // if track is not in next week's charts, animate to bottom of list
      }
      return <Track key={track.title} track={track} nextTrackRank={nextTrackRank} />;
    });

    const currentTrackNames = this.props.chart.map(track => track.title);
    let tracksOnDeck = this.props.nextChart.filter(trackOnDeck => {
      return (!currentTrackNames.includes(trackOnDeck.title));
    });

    tracksOnDeck = tracksOnDeck.map(trackOnDeck => {
      const dummyTrack = {
        title: trackOnDeck.title,
        rank: 13
      };
      return <Track key={trackOnDeck.title} track={dummyTrack} nextTrackRank={trackOnDeck.rank}/>;
    });

    return (
      <div id='graph'>
        <Title date={this.toDate(this.props.date)} artist={this.props.chart[0].artist} />
        <ul id='trackList'>
          {tracks}
          {tracksOnDeck}
        </ul>
      </div>
    );
  }
}

export default Graph;
