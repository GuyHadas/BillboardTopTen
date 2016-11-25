import React from 'react';
import ReactDOM from 'react-dom';

class Genres extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id='genres'>
        <div onClick={() => this.props.playGenre('hot100')}>Hot 100</div>
        <div onClick={() => this.props.playGenre('alternative')}>Alternative</div>
      </div>
    );
  }
}

export default Genres;
