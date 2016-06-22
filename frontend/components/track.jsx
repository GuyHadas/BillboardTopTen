var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = React.createClass({
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
    return (
      <div>{this.props.track.rank}: {this.props.track.title}</div>
    );
  }
});

module.exports = Track;
