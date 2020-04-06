import React, { Component } from 'react';
import { Button } from 'reactstrap';

// CSS
import '../../Styles/language.css';

class LanguageBtn extends Component {
    render() {
        return(
            <div>
                <Button className="English" onClick={() => localStorage.setItem('language', 1) + this.props.reRender()} />

                <Button className="Finnish" onClick={() => localStorage.setItem('language', 0) + this.props.reRender()} />
            </div>
        )
    }
}

export default LanguageBtn;