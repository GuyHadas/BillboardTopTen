import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import moment from "moment";

import Track from './track.jsx';
import { Title } from './title.jsx';

class Graph extends React.Component{
  constructor(props){
    super(props);
    this.formatDate = this.formatDate.bind(this);
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  render() {
    const currentTracks = _.map(this.props.chart, 'title'); // title must act as primary key
    const nextChartTracks = _.map(this.props.nextChart, 'title'); // title must act as primary key

    const trackComponents = _.map(this.props.chart, track => {
      let nextTrackRank = nextChartTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

      if (nextTrackRank === 0) {
        nextTrackRank = 13; // if track is not in next week's charts, animate to bottom of list
      }

      return <Track key={track.title} track={track} nextTrackRank={nextTrackRank} />;
    });

    let tracksOnDeck = _.filter(this.props.nextChart, trackOnDeck => !currentTracks.includes(trackOnDeck.title));

    const trackOnDeckComponents = tracksOnDeck.map(trackOnDeck => {
      // renders the track to the staging area at the bottom of the list
      const dummyTrack = {
        title: trackOnDeck.title,
        rank: 13
      };

      return <Track key={trackOnDeck.title} track={dummyTrack} nextTrackRank={trackOnDeck.rank}/>;
    });

    return (
      <div id='graph'>
        <Title date={this.formatDate(this.props.date)} artist={this.props.chart[0].artist} />
        <ul id='trackList'>
          {trackComponents}
          {trackOnDeckComponents}
        </ul>
      </div>
    );
  }
}

export default Graph;
