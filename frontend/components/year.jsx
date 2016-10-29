import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';

class Year extends React.Component{
  constructor(props){
    super(props);
    this.playFromYear = this.playFromYear.bind(this);
  }

  playFromYear() {
    this.props.showMonths(this.props.year);
    this.props.setChartDate(this.props.yearDates[0]);
  }

  render() {
    return (
        <div className="decadeYear" onClick={this.playFromYear}>
          {this.props.year}
        </div>
    );
  }
}

export default Year;
