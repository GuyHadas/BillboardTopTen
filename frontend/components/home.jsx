var React = require("react");
var ReactDOM = require("react-dom");
var HashHistory = require('react-router').hashHistory;

var Track = require("./track.jsx");

var Home = React.createClass({
  getInitialState: function() {
    return { charts: null };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'billboard-data.json',
      success: function(charts) {
        self.setState({charts: charts});
      }
    });
  },

  render: function() {
    if (!this.state.charts) {
      var list = <div>Loading...</div>;
    } else {
      list = [];
       for (var i = 0; i < 10; i++) {
         var chart = this.state.charts[Object.keys(this.state.charts)[i]];
         list.push(<div>{Object.keys(this.state.charts)[i]}</div>);
         for (var j = 0; j < 10; j++) {
           list.push(<Track track={chart[j]}/>);
         }
         list.push(<br/>);
      }
    }
    return (
      <ul>
        {list}
      </ul>
    );
  }
});

module.exports = Home;
