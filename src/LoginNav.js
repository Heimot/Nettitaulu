import React from 'react';
import { Collapse, Navbar, NavbarBrand } from 'reactstrap';
import './Styles/loginNav.css';

export default class LoginNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar className="loginNav" light toggleable color="info" fixed="top">
          <NavbarBrand href="/">Kirjautumis sivu</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}
