var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Graph = require("./graph.jsx");
var AudioPlayer = require("./audioPlayer.jsx");
var Sound = require('react-sound');


var Home = React.createClass({
  getInitialState: function() {
    return {
      charts: null,
      currentDate: null,
      currentTrackURL: null,
      soundPlaying: true
     };
  },

  componentDidMount: function() {
    // this.getTopSearchResults("kanye");
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        console.log("charts: ", charts);
        self.setState({
          charts: charts,
          currentDate: Object.keys(charts)[0],
        });
        self.incrementCharts();

        var topSong = charts[Object.keys(charts)[0]][0];
        if (topSong.spotify_id) {
          self.getSongInfo(topSong.spotify_id);
        } else {
           var title = topSong.title.split(" ").join("+");
           title = title.replace(/[^a-zA-Z+ ]/g, "");
           var artist = topSong.artist.split(" ")[0];
           artist = artist.replace(/[^a-zA-Z+ ]/g, "");
           var query = [title, artist].join("+");
           self.playTopSong(query);
        }
      }
    });
  },

  incrementCharts: function() {
    var self = this;
    var i = 1;
    var nextDate = setInterval(function() {
      self.setState({ currentDate: Object.keys(self.state.charts)[i] });
      var topSong = self.state.charts[Object.keys(self.state.charts)[i]][0];
      if (topSong.spotify_id) {
        self.getSongInfo(topSong.spotify_id);
      } else {
         var title = topSong.title.split(" ").join("+");
         title = title.replace(/[^a-zA-Z+ ]/g, "");
         var artist = topSong.artist.split(" ")[0];
         artist = artist.replace(/[^a-zA-Z+ ]/g, "");
         var query = [title, artist].join("+");
         self.playTopSong(query);
      }
      i += 1;
      if ( i == Object.keys(self.state.charts).length - 1) {
        clearInterval(nextDate);
      }
    }, 7000);
  },

  getSongInfo: function(spotifyId) {
    var self = this;
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/tracks/" + spotifyId,
      success: function(track) {
        var title = track.name.split(" ").join("+");
        title = title.replace(/[^a-zA-Z+ ]/g, "");
        var artist = track.artists[0].name.split(" ").join("+");
        artist = artist.replace(/[^a-zA-Z+ ]/g, "");
        var query = [title, artist].join("+");
        self.playTopSong(query);
      }
    });
  },

  playTopSong: function(query) {
    var self = this;
    $.ajax({
      type: "GET",
      url: "https://itunes.apple.com/search?term=" + query + "&country=us&limit=5&media=music",
      dataType: "jsonp",
      success: function(results) {
        self.setState({ currentTrackURL: results.results[0].previewUrl });
      }
    });
  },

  toggleSound: function(e) {
    e.preventDefault();
    this.setState({ soundPlaying: !this.state.soundPlaying });
  },

  render: function() {
    if (!this.state.charts) {
      var graph = <div>Loading...</div>;
    } else {
      graph = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        />;
      if (this.state.currentTrackURL) {
        var volume = this.state.soundPlaying ? 100 : 0;
        var pausePlay = this.state.soundPlaying ? "Pause" : "Play";
         var audio =
         <div>
           <Sound playStatus={Sound.status.PLAYING} volume={volume} url={this.state.currentTrackURL}/>
           <div onClick={this.toggleSound} className="toggle-sound">{pausePlay}</div>
         </div>;
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


// fix We Are Young - F.U.N query
