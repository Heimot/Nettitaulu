import React from 'react';
import { Collapse, Navbar, NavbarBrand } from 'reactstrap';

export default class TopNav extends React.Component {
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
        <Navbar light toggleable color="info">
          <NavbarBrand href="/">Kirjautumis sivu</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
