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

  getLinesForSection(sectionNum, startingChart, endingChart, color) {
    const STAGING_AREA_RANK = 11;
    const startingTracks = _.map(startingChart, 'title');
    const endingTracks = _.map(endingChart, 'title');
    const tracksOnDeck = _.filter(endingChart, trackOnDeck => {
      return !(_.includes(startingTracks, trackOnDeck.title));
    });

    let lines = _.map(startingChart, track => {
      let nextTrackRank = endingTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

      if (nextTrackRank === 0) {
        nextTrackRank = STAGING_AREA_RANK; // if track is not in next week's charts, animate to bottom of list
      }

      return <Line
        color={color}
        key={track.title + sectionNum}
        weekPosition={sectionNum}
        y1={track.rank * 55}
        y2={nextTrackRank * 55}/>;
    });

    const tracksOnDeckLines = tracksOnDeck.map(trackOnDeck => {
      return <Line
        color={color}
        key={trackOnDeck.title}
        weekPosition={sectionNum}
        y1={STAGING_AREA_RANK * 55}
        y2={trackOnDeck.rank * 55}
        />;
    });

    return lines.concat(tracksOnDeckLines);
  }

  render() {
    const sectionZero = this.getLinesForSection(0, this.props.chart, this.props.nextChart, '#FEF59E');
    const sectionOne = this.getLinesForSection(1, this.props.lastChart, this.props.chart, '#98CC9F');
    const sectionTwo = this.getLinesForSection(2, this.props.twoWeeksBackChart, this.props.lastChart, '#998AC0');
    const sectionThree = this.getLinesForSection(3, this.props.threeWeeksBackChart, this.props.twoWeeksBackChart, '#8AD2F4');
    const sectionFour = this.getLinesForSection(4, this.props.fourWeeksBackChart, this.props.threeWeeksBackChart, '#F4B589');

    return (
      <svg width={700} height={579} style={{border: '1px solid white', backgroundColor: 'black'}}>
        {sectionZero}
        {sectionOne}
        {sectionTwo}
        {sectionThree}
        {sectionFour}
      </svg>
    );
  }
}

export default Chart;
