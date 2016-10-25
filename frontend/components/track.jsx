import React from "react";
import ReactDOM from "react-dom";

class Track extends React.Component{

  constructor(props) {
    super(props);
    this.state = {top: this.props.track.rank * 55 + 25};
  }

  componentDidMount() {
    this.setState({top: this.props.track.rank * 55 + 25 });
  }

  componentDidUpdate() {
    var self = this;
    window.setTimeout(function() {
      if (self.state.top !== self.props.nextTrackRank * 55 + 25) {
        self.setState({top: self.props.nextTrackRank * 55 + 25 });
      }
    } , 1000);
  }

  render() {
    const top = this.state.top;
    const left = this.props.left;
    return (
      <div className="trackBox"
        style={{
          top: top,
          position: 'absolute'
        }}>
        {this.props.track.title}
      </div>
    );
  }
}

export default Track;
