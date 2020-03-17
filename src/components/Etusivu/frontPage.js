import React, { Component } from "react";
import { Input, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';

//CSS
import "../../Styles/frontPage.css";

//PICTURE
import picture from "../../pictures/kuva.jpg"


class frontPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
        }
    }

    render() {

        if (this.state.redirect) {
            return (<Redirect to={'/main/tables'} />)
        }

        return (
            <div className="frontPage">
                <div className="frontPageMenu">
                    <Button className="redirect" onClick={() => this.setState({ redirect: true })}>Etusivu</Button>
                </div>
                <h1 className="frontText">Ohjelma</h1>
                <img className="frontPagePicture" src={picture}></img>
            </div>
        )
    }
}

export default frontPage;