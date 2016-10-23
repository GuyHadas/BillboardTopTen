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
      trackMetaData: null,
      currentDate: null,
      currentTrackURL: null,
      soundPlaying: false,
      nextChartDate: null
     };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        console.log('Successfully loaded charts: ', charts);
        $.ajax({
          type: 'GET',
          url: 'track-meta.json',
          success: function(trackMetaData) {
            console.log('Successfully loaded meta data: ', trackMetaData);
            self.setState({
              trackMetaData: trackMetaData,
              charts: charts,
              currentDate: Object.keys(charts)[0],
              nextChartDate: Object.keys(charts)[1],
              currentTrackURL: trackMetaData[Object.keys(charts)[0]]['previewUrl']
            });
            self.incrementCharts();
          }
        });
      }
    });
  },

  incrementCharts: function() {
    var self = this;
    var i = 1;
    var nextDate = setInterval(function() {
      self.setState({
        currentDate: Object.keys(self.state.charts)[i],
        nextChartDate: Object.keys(self.state.charts)[i + 1],
        currentTrackURL: self.state.trackMetaData[Object.keys(self.state.charts)[i]]['previewUrl']
      });
      i += 1;
      if ( i === Object.keys(self.state.charts).length - 1) {
        clearInterval(nextDate);
      }
    }, 7000);
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
        nextChart={this.state.charts[this.state.nextChartDate]}
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
