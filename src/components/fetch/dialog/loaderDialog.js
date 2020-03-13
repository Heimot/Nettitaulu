import React, { Component } from 'react';

let dialogStyles = {
    width: '1000px',
    maxWidth: '100%',
    height: '500px',
    maxHeight: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    backgroundColor: '#eee',
    padding: '10px 20px 40px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    resize: 'both',
    overflow: 'auto'
};

let dialogDisabler = {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    backgroundColor: '#808080',
    display: 'flex',
    flexDirection: 'column',
    opacity: 0.5
}

class Dialogs extends Component {
    render() {
        let dialog = (
            <div>
                <div style={dialogDisabler}>
                </div>
                <div style={dialogStyles}>
                    <div>{this.props.children}</div>
                </div>
            </div>
        );
        if (!this.props.isOpen2) {
            dialog = null;
        }
        return (
            <div>
                {dialog}
            </div>
        )
    }
}

export default Dialogs;