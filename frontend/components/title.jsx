import React from 'react';
import ReactDOM from 'react-dom';


class Title extends React.Component{
  constructor(props){
    super(props);
  }

  trimArtist(artist) {
    return artist.indexOf('Featuring') === -1 ? artist : artist.substring(0, artist.indexOf(' Featuring'));
  }

  render() {
    return (
      <div id='titleBox'>
        <div id="navLogo">
          <img id="billboard-logo" src="billboard-logo.png" width='100'/>
          <span id="genre-title">Hot 100</span>
        </div>
        <span id='titleArtist'>{this.trimArtist(this.props.artist)}</span>
        <span>was #1 on</span>
        <span id='titleDate'>{this.props.date}</span>
      </div>
    );
  }
}

export default Title;
