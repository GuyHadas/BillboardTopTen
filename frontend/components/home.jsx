var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Graph = require("./graph.jsx");

var Home = React.createClass({
  getInitialState: function() {
    return { charts: null, currentChart: null };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        self.setState({charts: charts, currentChart: charts[Object.keys(charts)[0]]});
      }
    });
  },

  

  render: function() {
    if (!this.state.charts) {
      var graph = <div>Loading...</div>;
    } else {
      graph = <Graph chart={this.state.currentChart}/>;
    }
    return (
      <div>
        {graph}
      </div>
    );
  }
});

module.exports = Home;
