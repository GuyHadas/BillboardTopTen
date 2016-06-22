var React = require("react");
var ReactDOM = require("react-dom");

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;
var HashHistory = require('react-router').hashHistory;

var Home = require("./components/home.jsx");

var Billboard = React.createClass({

  render: function() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

var routes = (
  <Route path="/" component={Billboard}>
    <IndexRoute component={Home} />
  </Route>
);

document.addEventListener("DOMContentLoaded", function(){
  ReactDOM.render(
    <Router history={HashHistory}>
      {routes}
    </Router>, document.getElementById('root'));
});
