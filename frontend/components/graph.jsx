var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = require('./track.jsx');

var Graph = React.createClass({
  // getInitialState: function() {
  //
  // },
  //
  // componentDidMount: function() {
  //
  // },
  //
  // componentWillUnmount: function() {
  //
  // },
  //
  // __onChange: function() {
  //
  // },

  render: function() {
    var tracks = this.props.chart.map(function(track) {
      return <Track key={track.rank} track={track} />;
    });

    return (
      <ul>
        {tracks}
      </ul>
    );
  }
});

module.exports = Graph;
