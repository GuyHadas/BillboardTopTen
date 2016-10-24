import React from "react";
import ReactDOM from "react-dom";

import Track from './track.jsx';
import { Title } from './title.jsx';

class Graph extends React.Component{
  constructor(props){
    super(props);
    this.toDate = this.toDate.bind(this);
  }
  toDate(date) {
    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December"
    };

    return months[date.slice(5, 7)] + " " + date.substring(8, 10) + ", " + date.substring(0, 4);
  }

  render() {
    const date = this.toDate(this.props.date);
    const nextChartIds = this.props.nextChart.map(function(track) {
      return track.spotify_id;
    });
    const tracks = this.props.chart.map(function(track) {
      let nextTrackRank = nextChartIds.indexOf(track.spotify_id) + 1; // index 0 should be rank 1, etc...
      if (nextTrackRank === 0) {
        nextTrackRank = 11; // if track is not in next week's charts, animate to bottom of list
      }
      return <Track key={track.rank} track={track} nextTrackRank={nextTrackRank} />;
    });

    return (
      <div id="graph">
        <Title date={this.toDate(this.props.date)} artist={this.props.chart[0].artist} />
        <ul id="trackList">
          {tracks}
        </ul>
      </div>
    );
  }
}

export default Graph;
