import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
var Surface = require('react-canvas').Surface;
var Text = require('react-canvas').Text;

class Chart extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    let textStyle = {
      top: 10,
      left: 0,
      width: 300,
      height: 100,
      lineHeight: 20,
      fontSize: 28
    };

    return (
      <div id='chart'>
        <Surface>
          <Text style={textStyle}>
            Here is some text below an image.
          </Text>
        </Surface>
      </div>
    );
  }
}

export default Chart;
