import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

class IntroModal extends React.Component{

  constructor(props){
    super(props);

    this.style = {
      overlay : {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backgroundImage: 'url("assets/BackgroundModal.png")',
        backgroundSize: 'cover'
      },
      content : {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 600,
        height: 400,
        border: '1px solid white',
        backgroundImage: 'url("assets/AlbumCovers.png")',
        backgroundSize: 'cover',
        background: 'black',
        overflow: 'auto',
        borderRadius: '25px',
        outline: 'none',
        padding: 'none',
        boxShadow:  '2px 2px 2px 1px rgba(0, 0, 0, 0.2)'

      }
    };
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isModalOpen}
        style={this.style}
        onRequestClose={this.props.onRequestClose}
        contentLabel='modal'>
        <div id='modalDescription'>
          A visualization of how &nbsp;
          <img src='billboard-logo.png' width='100'/>
          &nbsp;
          top 10 music has changed over time
        </div>
        <img id='modalPlayButton' src="assets/Triangle.png" onClick={this.props.onRequestClose}/>
        <img id='modalHeadphonesImg' src="assets/Headphones.png"/>
        <span id='modalFooter'>Headphones Suggested</span>
      </Modal>
    );
  }
}

export default IntroModal;
