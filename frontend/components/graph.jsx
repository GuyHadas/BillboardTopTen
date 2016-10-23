var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = require('./track.jsx');
var Title = require('./title.jsx');

var Graph = React.createClass({

  toDate: function(date) {
    var months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December"
    };

    return months[date.slice(5, 7)] + " " + date.substring(8, 10) + ", " + date.substring(0, 4);
  },

  render: function() {
    var date = this.toDate(this.props.date);
    var tracks = this.props.chart.map(function(track) {
      return <Track key={track.rank} track={track} />;
    });

    return (
      <div id="graph">
        <Title date={this.toDate(this.props.date)} artist={this.props.chart[0].artist} />
        <ul id="trackList">
          {tracks}
        </ul>
      </div>
    );
  }
});

module.exports = Graph;
