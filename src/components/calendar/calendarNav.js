import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import ErrorBoundary from '../errorCatcher/ErrorBoundary';
import { Redirect } from 'react-router-dom';
import language from '../language/language';

// CSS
import '../../Styles/calendarNav.css';

class CalendarNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            calRed: false
        }
    }
    render() {
        let { calRed } = this.state;
        if (calRed) {
            return (<Redirect to={"/main"} />)
        }
        return (
            <ErrorBoundary>
                <div>
                    <Navbar className="loginNav" light toggleable color="info" fixed="top">
                        <NavbarBrand className="kalenteriNav" onClick={() => this.setState({ calRed: true })}>Kalenteri</NavbarBrand>
                    </Navbar>
                </div>
            </ErrorBoundary>
        );
    }
}

export default CalendarNav;