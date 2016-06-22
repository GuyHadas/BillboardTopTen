var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Graph = require("./graph.jsx");

var Home = React.createClass({
  getInitialState: function() {
    return { charts: null, currentDate: null };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        self.setState({ charts: charts, currentDate: Object.keys(charts)[0] });
        self.incrementCharts();
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
    }, 3000);
  },

  render: function() {
    if (!this.state.charts) {
      var graph = <div>Loading...</div>;
    } else {
      graph = <Graph
        date={this.state.currentDate}
        chart={this.state.charts[this.state.currentDate]}
        />;
    }
    return (
      <div>
        {graph}
      </div>
    );
  }
});

module.exports = Home;
