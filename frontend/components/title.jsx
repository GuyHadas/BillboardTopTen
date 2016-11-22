import React from 'react';
import ReactDOM from 'react-dom';

export const Title = ({artist, date}) =>(
    <div id='titleBox'>
      <div id="navLogo">
        <img id="billboard-logo" src="billboard-logo.png" width='100'/>
        <span id="genre-title">Hot 100</span>
      </div>
      <span id='titleArtist'>{artist}</span>
      <span>was #1 on</span>
      <span id='titleDate'>{date}</span>
    </div>
);
