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
    const threeWeeksBackTracks = _.map(this.props.threeWeeksBackChart, 'title');
    const twoWeeksBackTracks = _.map(this.props.twoWeeksBackChart, 'title'); // title must act as primary key
    const lastWeekTracks = _.map(this.props.lastChart, 'title'); // title must act as primary key
    const currentTracks = _.map(this.props.chart, 'title'); // title must act as primary key
    const nextChartTracks = _.map(this.props.nextChart, 'title'); // title must act as primary key

    const tracksOnDeckSectionOne = _.filter(this.props.nextChart, trackOnDeck => {
      return !(_.includes(currentTracks, trackOnDeck.title));
    });
    const tracksOnDeckSectionTwo = _.filter(this.props.chart, trackOnDeck => {
      return !(_.includes(lastWeekTracks, trackOnDeck.title));
    });
    const tracksOnDeckSectionThree = _.filter(this.props.lastChart, trackOnDeck => {
      return !(_.includes(twoWeeksBackTracks, trackOnDeck.title));
    });
    const tracksOnDeckSectionFour = _.filter(this.props.twoWeeksBackChart, trackOnDeck => {
      return !(_.includes(threeWeeksBackTracks, trackOnDeck.title));
    });

    const lineComponentsSectionOne = _.map(this.props.chart, track => {
      let nextTrackRank = nextChartTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

      if (nextTrackRank === 0) {
        nextTrackRank = stagingAreaRank; // if track is not in next week's charts, animate to bottom of list
      }

      return <Line
        color='#FEF59E'
        key={track.title + '0'}
        weekPosition={0}
        y1={track.rank * 55}
        y2={nextTrackRank * 55}/>;
    });

    const trackOnDeckSectionOneComponents = tracksOnDeckSectionOne.map(trackOnDeck => {
      // renders the track to the staging area at the bottom of the list
      const dummyTrack = {
        rank: stagingAreaRank
      };

      return <Line
        color='white'
        key={trackOnDeck.title}
        weekPosition={0}
        y1={stagingAreaRank * 55}
        y2={trackOnDeck.rank * 55}
        />;
    });

    const lineComponentsSectionTwo = _.map(this.props.lastChart, track => {
      let nextTrackRank = currentTracks.indexOf(track.title) + 1;

      if (nextTrackRank === 0) {
        nextTrackRank = stagingAreaRank;
      }

      return <Line
        color='#998AC0'
        key={track.title + '1'}
        weekPosition={1}
        y1={track.rank * 55}
        y2={nextTrackRank * 55}/>;
    });

    const trackOnDeckSectionTwoComponents = tracksOnDeckSectionTwo.map(trackOnDeck => {

      return <Line
        color='#998AC0'
        key={trackOnDeck.title}
        weekPosition={1}
        y1={stagingAreaRank * 55}
        y2={trackOnDeck.rank * 55}/>;
    });

    const lineComponentsSectionThree = _.map(this.props.twoWeeksBackChart, track => {
      let nextTrackRank = lastWeekTracks.indexOf(track.title) + 1;

      if (nextTrackRank === 0) {
        nextTrackRank = stagingAreaRank;
      }

      return <Line
          color='#B1E2DA'
          key={track.title + '2'}
          weekPosition={2}
          y1={track.rank * 55}
          y2={nextTrackRank * 55}/>;
      });

      const trackOnDeckSectionThreeComponents = tracksOnDeckSectionThree.map(trackOnDeck => {
        return <Line
          color='#B1E2DA'
          key={trackOnDeck.title}
          weekPosition={2}
          y1={stagingAreaRank * 55}
          y2={trackOnDeck.rank * 55}/>;
      });

      const lineComponentsSectionFour = _.map(this.props.threeWeeksBackChart, track => {
        let nextTrackRank = twoWeeksBackTracks.indexOf(track.title) + 1;

        if (nextTrackRank === 0) {
          nextTrackRank = stagingAreaRank;
        }

        return <Line
            color='#98CC9F'
            key={track.title + '3'}
            weekPosition={3}
            y1={track.rank * 55}
            y2={nextTrackRank * 55}/>;
        });

      const trackOnDeckSectionFourComponents = tracksOnDeckSectionFour.map(trackOnDeck => {
        return <Line
          color='#98CC9F'
          key={trackOnDeck.title}
          weekPosition={3}
          y1={stagingAreaRank * 55}
          y2={trackOnDeck.rank * 55}/>;
      });

    return (
      <svg width={700} height={579} style={{border: '1px solid white', backgroundColor: 'black'}}>
        {lineComponentsSectionOne}
        {trackOnDeckSectionOneComponents}
        {lineComponentsSectionTwo}
        {trackOnDeckSectionTwoComponents}
        {lineComponentsSectionThree}
        {trackOnDeckSectionThreeComponents}
        {lineComponentsSectionFour}
        {trackOnDeckSectionFourComponents}
      </svg>
    );
  }
}

export default Chart;
