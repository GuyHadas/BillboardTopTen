var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Title = React.createClass({

  render: function() {
    return (
      <div id="titleBox">
        <span id="titleArtist">{this.props.artist}</span>
        <span id="titleDate">{this.props.date}</span>
      </div>
    );
  }
});

module.exports = Title;
