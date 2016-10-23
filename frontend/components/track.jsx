var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = React.createClass({

  render: function() {
    var top = ((this.props.track.rank) * 50);
    return (
      <div className="trackBox"
        style={{
          top: top,
          position: 'absolute'
        }}
        >
        {this.props.track.title}
      </div>
    );
  }
});

module.exports = Track;
