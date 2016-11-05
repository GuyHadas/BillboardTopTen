import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Line from './line.jsx';

class Chart extends React.Component{
  constructor(props){
    super(props);
  }

  getRandomColor() {
    let colors = [
      '#FEF59E', // pastel yellow
      '#98CC9F', // pastel lime green
      '#998AC0', // pastel dark purple
      '#8AD2F4', // pastel turquoise
      '#F4B589', // pastel orange
      '#F3ECDC', // pastel white
      '#C897C0', // pastel light purple
      '#98CC9F', // pastel dark green
      '#F19A7B', // pastel orange
      '#B1E2DA' // pastel teal
    ];

    let randIdx = Math.floor(Math.random() * 10);

    return colors[randIdx];
  }

  render() {
    const stagingAreaRank = 11;
    const currentTracks = _.map(this.props.chart, 'title'); // title must act as primary key
    const nextChartTracks = _.map(this.props.nextChart, 'title'); // title must act as primary key

    const lineComponents = _.map(this.props.chart, track => {
      let nextTrackRank = nextChartTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

      if (nextTrackRank === 0) {
        nextTrackRank = stagingAreaRank; // if track is not in next week's charts, animate to bottom of list
      }

      return <Line
        color={this.getRandomColor()}
        key={track.title}
        startingX={700}
        y1={track.rank * 55}
        y2={nextTrackRank * 55}/>;
    });

    return (
      <svg width={700} height={579} style={{border: '1px solid white', backgroundColor: 'black'}}>
        {lineComponents}
      </svg>
    );
  }
}

export default Chart;
