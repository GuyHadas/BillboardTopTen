import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import StringHash from 'string-hash';

import Line from './line.jsx';

class Chart extends React.Component{
  constructor(props){
    super(props);
  }

  getColorForTitle(trackTitle) {
    let hash = StringHash(trackTitle);

    let colors = [
      '#FEF59E', // yellow
      '#98CC9F', // lime green
      '#998AC0', // dark purple
      '#8AD2F4', // turquoise
      '#F4B589', // orange
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
        color={this.getColorForTitle(track.title)}
        key={track.title + sectionNum}
        weekPosition={sectionNum}
        y1={track.rank * 55}
        y2={nextTrackRank * 55}/>;
    });

    const tracksOnDeckLines = tracksOnDeck.map(trackOnDeck => {
      return <Line
        color={this.getColorForTitle(trackOnDeck.title)}
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
      <svg width={700} height={579} style={{borderLeft: '1px solid white', backgroundColor: 'black'}}>
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
