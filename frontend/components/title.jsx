import React from "react";
import ReactDOM from "react-dom";

const Title = ({artist, date}) =>(
    <div id="titleBox">
      <span id="titleArtist">{artist}</span>
      <span id="titleDate">{date}</span>
    </div>
);

export default Title;
