import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

class IntroModal extends React.Component{

  constructor(props){
    super(props);

    this.style = {
      overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
      },
      content : {
        position                   : 'absolute',
        top                        : '40px',
        left                       : '40px',
        right                      : '40px',
        bottom                     : '40px',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        padding                    : '20px'

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
        <h1>Hello world!</h1>
      </Modal>
    );
  }
}

export default IntroModal;
