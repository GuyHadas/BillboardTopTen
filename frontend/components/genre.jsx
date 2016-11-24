import React from 'react';
import ReactDOM from 'react-dom';

class Genres extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id='genres'>
        <div>genre 1</div>
        <div>genre 2</div>
      </div>
    );
  }
}

export default Genres;
