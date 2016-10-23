var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = React.createClass({

  getInitialState: function() {
    return { top: (this.props.track.rank * 55) + 25 };
  },

  componentDidUpdate: function() {
    if (this.state.top !== (this.props.nextTrackRank * 55) + 25) {
      this.setState({ top: (this.props.nextTrackRank * 55) + 25 });
    }
  },

  render: function() {
    var top = this.state.top;

    return (
      <div className="trackBox"
        style={{
          top: top,
          position: 'absolute'
        }}>
        {this.props.track.title}
      </div>
    );
  }
});

module.exports = Track;
