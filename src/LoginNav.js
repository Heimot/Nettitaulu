import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import './Styles/loginNav.css';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';

export default class LoginNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    try {
      this.setState({
        isOpen: !this.state.isOpen
      });
    } catch (error) {
      console.log(error);
    };
  }
  render() {
    return (
      <ErrorBoundary>
        <div>
          <Navbar className="loginNav" light toggleable color="info" fixed="top">
            <NavbarBrand href="/">Kirjautumis sivu</NavbarBrand>
          </Navbar>
        </div>
      </ErrorBoundary>
    );
  }
}
