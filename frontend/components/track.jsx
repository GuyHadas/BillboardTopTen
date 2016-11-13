import React from 'react';
import ReactDOM from 'react-dom';

class Track extends React.Component{

  constructor(props) {
    super(props);
    this.calculateDistanceFromTop = this.calculateDistanceFromTop.bind(this);
    this.state = { top: this.calculateDistanceFromTop(this.props.track.rank) };
  }

  calculateDistanceFromTop(rank) {
    return (Number(rank) * 55) + 25;
  }

  componentDidMount() {
    this.setState({ top: this.calculateDistanceFromTop(this.props.track.rank) });
  }

  componentDidUpdate() {
    window.setTimeout(() => {
      if (this.state.top !== this.calculateDistanceFromTop(this.props.nextTrackRank)) {
        this.setState({ top: this.calculateDistanceFromTop(this.props.nextTrackRank) });
      }
    } , 70); // this plus css transition time must equal setIntervalTime from #incrementCharts
  }

  render() {
    const distanceFromTop = this.state.top;

    return (
      <div className='trackBox'
        style={{
          top: distanceFromTop,
          position: 'absolute'
        }}>
        {this.props.track.title}
      </div>
    );
  }
}

export default Track;
