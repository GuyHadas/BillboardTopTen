var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Graph = require("./graph.jsx");

var Home = React.createClass({
  getInitialState: function() {
    return {
      charts: null,
      currentDate: null,
      currentTrackURL: null
     };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        self.setState({
          charts: charts,
          currentDate: Object.keys(charts)[0],
        });
        self.incrementCharts();
        self.playTopSong(charts[Object.keys(charts)[0]][2].spotify_id);
      }
    });
  },

  incrementCharts: function() {
    var self = this;
    var i = 1;
    var nextDate = setInterval(function() {
      self.setState({ currentDate: Object.keys(self.state.charts)[i] });
      i += 1;
      if ( i == Object.keys(self.state.charts).length - 1) {
        clearInterval(nextDate);
      }
    }, 7000);
  },

  playTopSong: function(spotify_id) {
    console.log(spotify_id);
    var self = this;
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/tracks/" + spotify_id,
      success: function(track) {
        console.log(track);

        self.setState({ currentTrackURL: track.preview_url });
      }
    });
  },

  render: function() {
    console.log(this.state.currentTrackURL);
    if (!this.state.charts) {
      var graph = <div>Loading...</div>;
    } else {
      graph = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        />;
      var audio = <embed
        src={this.state.currentTrackURL}
        autostart="true"
        loop="true"
        className="audio"
        />;

    }
    return (
      <div>
        {graph}
        {audio}
      </div>
    );
  }
});

module.exports = Home;
