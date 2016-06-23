var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Graph = require("./graph.jsx");
var AudioPlayer = require("./audioPlayer.jsx");

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
      self.playTopSong(self.state.charts[Object.keys(self.state.charts)[i]][0].spotify_id);
      i += 1;
      if ( i == Object.keys(self.state.charts).length - 1) {
        clearInterval(nextDate);
      }
    }, 7000);
  },

  playTopSong: function(spotify_id) {
    var self = this;
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/tracks/" + spotify_id,
      success: function(track) {
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
      if (this.state.currentTrackURL) {
        var audio = <AudioPlayer trackURL={this.state.currentTrackURL}/>;
        // this.state.currentTrack.play();
        // this.state.currentTrack.pause();
      }
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
