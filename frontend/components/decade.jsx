import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';

class Decade extends React.Component{
  constructor(props){
    super(props);
    this.showYears = this.showYears.bind(this);
    this.hideYears = this.hideYears.bind(this);
    this.animateYears = this.animateYears.bind(this);
    this.state = {
      showYears: false,
      years: []
    };
  }

  showYears() {
    if (this.state.showYears === false) {
      console.log('changing');
      this.setState({ showYears: true });
      this.animateYears(this.props.years.slice());
    }
  }

  animateYears(_years) {
    if (_years.length > 0) {
      this.timeout = setTimeout(() => {
        this.setState({ years: this.state.years.concat(_years.shift()) });
        this.animateYears(_years);
      }, 40);
    }
  }

  hideYears() {
    clearTimeout(this.timeout);
    this.setState({ showYears: false, years: [] });
  }

  render() {
    let years;
    let headerColor = 'white';

    if (this.state.showYears) {
      headerColor = 'rgba(255, 123, 109, 0.5)';

      years = _.map(this.state.years, year => {
        return <span key={year} className="decadeYear">{year}</span>;
        });
    }

    return (
      <div className="decade" onMouseLeave={this.hideYears}>
          <span className="decadeHeader" onMouseEnter={this.showYears} style={{ color: headerColor }}>{this.props.decade}</span>
          <div className="decadeYears">
            {years}
          </div>
      </div>
    );
  }
}

export default Decade;
