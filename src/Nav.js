import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, InputGroupAddon, Button, Input } from 'reactstrap';

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
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">React</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <Input placeholder="Kukan nimi" id="number" type="string" onChange={(evt) => { global.nimi11 = evt.target.value; }} />
              <InputGroupAddon><Button onClick={() => alert(global.nimi11)}>Search</Button></InputGroupAddon>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
