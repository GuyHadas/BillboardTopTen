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
    let sound = this.props.isSoundOn ? <i className="fa fa-volume-up"/> : <i className="fa fa-volume-off"/>;

    return (
      <div id='titleBox'>
        <div id="navLogo">
          <img id="billboard-logo" src="billboard-logo.png" width='100'/>
          <span id="genre-title">Hot 100</span>
        </div>
        <div id='navHeader'>
          <span id='titleArtist'>{this.trimArtist(this.props.artist)}</span>
          <span>was #1 on</span>
          <span id='titleDate'>{this.props.date}</span>
        </div>
        <div onClick={this.props.toggleSound}
             className='toggle-sound'>
             {sound}
        </div>
      </div>
    );
  }
}

export default Title;
