import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class Line extends React.Component{

  constructor(props){
    super(props);
    this.LINE_LENGTH = 175;
    this.state = {
      x1: this.calculateStartingX(this.props.weekPosition),
      x2: this.calculateStartingX(this.props.weekPosition) + this.LINE_LENGTH,
    };

    this.calculateStartingX = this.calculateStartingX.bind(this);
  }

  calculateStartingX(weekPosition) {
    return 700 - (weekPosition * this.LINE_LENGTH);
  }

  render() {
    let coords = {
      x1: this.state.x1,
      y1: this.props.y1,
      x2: this.state.x2,
      y2: this.props.y2
    };

    return (
      <line {...coords} stroke={this.props.color} strokeWidth={3}>
        <animate attributeName="x1" from={this.state.x1} to={this.state.x1 - this.LINE_LENGTH} dur="3s" begin="0s" repeatCount="indefinite"/>
        <animate attributeName="x2" from={this.state.x2} to={this.state.x1} dur="3s" begin="0s" repeatCount="indefinite"/>
      </line>
    );
  }
}

export default Line;
