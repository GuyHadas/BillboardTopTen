import React from "react";
import ReactDOM from "react-dom";

class Track extends React.Component{

  constructor(props) {
    super(props);
    this.state = { top: (this.props.track.rank * 55) + 25 };
  }

  componentDidMount() {
    if (this.state.top !== (this.props.nextTrackRank * 55) + 25) {
      this.setState({ top: (this.props.nextTrackRank * 55) + 25 });
    }
  }

  componentDidUpdate() {
    if (this.state.top !== (this.props.nextTrackRank * 55) + 25) {
      this.setState({ top: (this.props.nextTrackRank * 55) + 25 });
    }
  }

  render() {
    const top = this.state.top;

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
