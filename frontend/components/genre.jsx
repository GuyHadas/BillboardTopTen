import React from 'react';
import ReactDOM from 'react-dom';

class Genres extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id='genres'>
        <div className='genre' id='hot100Genre' onClick={() => this.props.playGenre('hot100')}></div>
        <div className='genre' id='alternativeGenre' onClick={() => this.props.playGenre('alternative')}></div>
      </div>
    );
  }
}

export default Genres;
