import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class Line extends React.Component{

  constructor(props){
    super(props);
    this.LINE_LENGTH = 175;
    this.state = {
      x1: this.props.startingX,
      x2: this.props.startingX + this.LINE_LENGTH,
    };

    this.moveLine = this.moveLine.bind(this);
  }

  componentDidMount() {
    this.moveLine();
  }

  moveLine() {
    // Render is called 150 times every 3 seconds
    // Lines need to move a total of 175px every 3 seconds
    const VELOCITY = -(175 / 150);
    this.interval = setInterval(() => {
      if (_.max([this.state.x1, this.state.x2]) > 0) {
        this.setState({ x1: this.state.x1 + VELOCITY, x2: this.state.x2 + VELOCITY });
      }
    }, 20);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let coords = {
      x1: this.state.x1,
      y1: this.props.y1,
      x2: this.state.x2,
      y2: this.props.y2
    };

    return (
      <line {...coords} stroke={this.props.color} strokeWidth={3}/>
    );
  }
}

export default Line;
