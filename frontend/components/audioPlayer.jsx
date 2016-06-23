var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var AudioPlayer = React.createClass({


  componentDidMount: function() {

  },

  componentWillUnmount: function() {
    $("audio").stop();
  },

  render: function() {
    return (
      <audio autoPlay controls>
        <source src={this.props.trackURL} type="audio/mpeg" />
      </audio>
    );
  }
});

module.exports = AudioPlayer;
