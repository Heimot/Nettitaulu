import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, InputGroupAddon, Button, Input, CardText, CardBlock, Card, CardTitle } from 'reactstrap';
import Dialog from './components/editDialog';
import {Redirect} from 'react-router-dom';

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      redirect: false
    };
    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    sessionStorage.setItem("userData", '')
    sessionStorage.clear();
    this.setState({
      redirect: true
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    if(this.state.redirect) {
      return (<Redirect to={'/'}/>)
    }
    return (
      <div>
        <Navbar light toggleable color="info">
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">React</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <Input placeholder="Kukan nimi" id="number" type="string" onChange={(evt) => { global.nimi11 = evt.target.value; }} />
              <InputGroupAddon>
              <Button onClick={(e) => this.setState({ isOpen: true })}>Search
              <Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
              <Card>
                <CardBlock>
                  <CardTitle><Input placeholder={'Kaupan nimi'}></Input></CardTitle>
                  <CardText> <CardText className="label">Tuote</CardText><CardText className="label">tilattu määrä yht.</CardText><CardText className="label">toimitetaan</CardText><CardText className="label">lisätieto</CardText><CardText className="label">jäljellä</CardText><CardText className="label">keräyspiste</CardText></CardText>
                  <CardText><Input className="inputlabel" placeholder={'Nimi'}></Input><Input className="inputlabel" placeholder={'Määrä'}></Input><Input className="inputlabel" placeholder={'Toimitetaan'}></Input><Input className="inputlabel" placeholder={'Lisätieto'}></Input><Input className="inputlabel" placeholder={'Jäljellä'}></Input><Input className="inputlabel" placeholder={'Keräys'}></Input></CardText>
                  <CardText><Input className="inputlabel" placeholder={'Nimi'}></Input><Input className="inputlabel" placeholder={'Määrä'}></Input><Input className="inputlabel" placeholder={'Toimitetaan'}></Input><Input className="inputlabel" placeholder={'Lisätieto'}></Input><Input className="inputlabel" placeholder={'Jäljellä'}></Input><Input className="inputlabel" placeholder={'Keräys'}></Input></CardText>
                </CardBlock>
              </Card>
              </Dialog>
              </Button>
              </InputGroupAddon>
              <Button type='button' className='button' onClick={() => this.logOut()}>Kirjaudu ulos</Button>
              <NavItem>
                <NavLink href="/main">Components</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
