import React from 'react';
import ReactDOM from 'react-dom';

export const Title = ({artist, date}) =>(
    <div id='titleBox'>
      <span id='titleArtist'>{artist}</span>
      <span id='titleDate'>{date}</span>
    </div>
);
