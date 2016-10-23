import React from "react";
import ReactDOM from "react-dom";

class AudioPlayer extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillUnmount() {
    $("audio").stop();
  }

  componentWillReceiveProps() {
    $("source").attr("src", "");
    $("audio").stop();
  }

  render() {
    return (
      <audio autoPlay controls>
        <source src={this.props.trackURL} type="audio/mpeg" />
      </audio>
    );
  }
}

export default AudioPlayer;
