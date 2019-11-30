import React from 'react';
import DatePicker from "react-datepicker";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, InputGroupAddon, Button, Input, CardText, CardBlock, Card, CardTitle } from 'reactstrap';
import Dialog from './components/editDialog';
import { Redirect } from 'react-router-dom';
import format from "date-fns/format";


import "./Styles/Buttons.css";
import "react-datepicker/dist/react-datepicker.css";

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpen2: false,
      redirect: false,
      kauppa: '',
      nimi1: '',
      maara1: '',
      kerays1: '',

      nimi2: '',
      maara2: '',
      kerays2: '',

      nimi3: '',
      maara3: '',
      kerays3: '',

      nimi4: '',
      maara4: '',
      kerays4: '',

      nimi5: '',
      maara5: '',
      kerays5: '',

      location: 'Tuusjärvi',
      isLoading: true,
      startDate: null,
      dateValue: null,
      startDate2: new Date()
    };
    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  changeLocation() {
    if (this.state.isLoading) {
      this.setState({
        location: 'Ryönä',
        isLoading: false
      });
      localStorage.setItem("userLocation", this.state.location);
      window.location.reload()
    } else {
      this.setState({
        location: 'Tuusjärvi',
        isLoading: true
      });
      localStorage.setItem("userLocation", this.state.location);
      window.location.reload()
    }
  }

  logOut() {
    sessionStorage.setItem("userData", '');
    sessionStorage.clear();
    this.setState({
      redirect: true
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    console.log(this.state);
  }

  postData() {
    fetch('http://localhost:3002/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        kauppa: this.state.kauppa,
        date: format(this.state.startDate2, "dd/MM/yyyy"),
        kukka: {
          kukka1: {
            name: this.state.nimi1,
            toimi: this.state.maara1,
            kerays: this.state.kerays1,
          },
          kukka2: {
            name: this.state.nimi2,
            toimi: this.state.maara2,
            kerays: this.state.kerays2,
          },
          kukka3: {
            name: this.state.nimi3,
            toimi: this.state.maara3,
            kerays: this.state.kerays3,
          },
          kukka4: {
            name: this.state.nimi4,
            toimi: this.state.maara4,
            kerays: this.state.kerays4,
          },
          kukka5: {
            name: this.state.nimi5,
            toimi: this.state.maara5,
            kerays: this.state.kerays5,
          },
        }
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    console.log(this.state.startDate);
    if (sessionStorage.getItem('userDate')) {
      this.setState({
        dateValue: sessionStorage.getItem('userDate'),
        startDate: new Date()
      });
      console.log('???????')
    } else
      this.setState({
        startDate: new Date()
      });

    if (localStorage.getItem('userLocation') !== "Tuusjärvi") {
      this.setState({
        location: 'Tuusjärvi',
        isLoading: true
      });
    } else {
      this.setState({
        location: 'Ryönä',
        isLoading: false
      });

    }
  }

  handleChange2 = date => {
    this.setState({
      startDate: date
    });
  };

  handleChange3 = date => {
    this.setState({
      startDate2: date
    });
  };


  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    return (
      <div>
        <Navbar light toggleable color="info">
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">React</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <InputGroupAddon>
                <DatePicker
                  value={this.state.dateValue}
                  selected={this.state.startDate}
                  onChange={this.handleChange2}
                  onCalendarClose={() =>  sessionStorage.setItem('userDate', format(this.state.startDate, "dd/MM/yyyy"), window.location.reload())}
                  dateFormat="d/MM/yyyy"
                  withPortal
                />
              </InputGroupAddon>
              <Input placeholder="Kukan nimi" id="number" type="string" onChange={(evt) => { global.nimi11 = evt.target.value; }} />
              <InputGroupAddon>
                <Button>Search
              <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
                    <Card>
                      <CardBlock>

                        <CardTitle>

                          <DatePicker
                            selected={this.state.startDate2}
                            onChange={this.handleChange3}
                            dateFormat="d/MM/yyyy"
                          />

                          <Input name="kauppa"
                            onChange={this.handleChange}
                            placeholder={'Kaupan nimi'}>
                          </Input>

                        </CardTitle>

                        <CardText>

                          <CardText className="label">
                            Tuote
                      </CardText>

                          <CardText className="label">
                            Kerätään
                        </CardText>

                          <CardText className="label">
                            Keräyspiste
                          </CardText>

                        </CardText>

                        <CardText>

                          <Input className="inputlabel"
                            name="nimi1"
                            onChange={this.handleChange}
                            placeholder={'Nimi'}>
                          </Input>

                          <Input className="inputlabel"
                            name="maara1"
                            onChange={this.handleChange}
                            placeholder={'Määrä'}>
                          </Input>

                          <Input className="inputlabel"
                            name="kerays1"
                            onChange={this.handleChange}
                            placeholder={'Keräyspiste'}>
                          </Input>

                        </CardText>

                        <CardText>

                          <Input className="inputlabel"
                            name="nimi2"
                            onChange={this.handleChange}
                            placeholder={'Nimi'}>
                          </Input>

                          <Input className="inputlabel"
                            name="maara2"
                            onChange={this.handleChange}
                            placeholder={'Määrä'}>
                          </Input>

                          <Input className="inputlabel"
                            name="kerays2"
                            onChange={this.handleChange}
                            placeholder={'Keräyspiste'}>
                          </Input>


                        </CardText>

                        <CardText>

                          <Input className="inputlabel"
                            name="nimi3"
                            onChange={this.handleChange}
                            placeholder={'Nimi'}>
                          </Input>

                          <Input className="inputlabel"
                            name="maara3"
                            onChange={this.handleChange}
                            placeholder={'Määrä'}>
                          </Input>

                          <Input className="inputlabel"
                            name="kerays3"
                            onChange={this.handleChange}
                            placeholder={'Keräyspiste'}>
                          </Input>


                        </CardText>

                        <CardText>

                          <Input className="inputlabel"
                            name="nimi4"
                            onChange={this.handleChange}
                            placeholder={'Nimi'}>
                          </Input>

                          <Input className="inputlabel"
                            name="maara4"
                            onChange={this.handleChange}
                            placeholder={'Määrä'}>
                          </Input>

                          <Input className="inputlabel"
                            name="kerays4"
                            onChange={this.handleChange}
                            placeholder={'Keräyspiste'}>
                          </Input>

                        </CardText>

                        <CardText>

                          <Input className="inputlabel"
                            name="nimi5"
                            onChange={this.handleChange}
                            placeholder={'Nimi'}>
                          </Input>

                          <Input className="inputlabel"
                            name="maara5"
                            onChange={this.handleChange}
                            placeholder={'Määrä'}>
                          </Input>

                          <Input className="inputlabel"
                            name="kerays5"
                            onChange={this.handleChange}
                            placeholder={'Keräyspiste'}>
                          </Input>


                        </CardText>

                        <Button onClick={() => this.postData()}>
                          Luo uusi
                          </Button>

                      </CardBlock>
                    </Card>
                  </Dialog>
                </Button>
              </InputGroupAddon>

              <InputGroupAddon>
                <Button className='addBtn' color='primary' type='button' onClick={(e) => this.setState({ isOpen2: true })}></Button>
              </InputGroupAddon>

              <InputGroupAddon>
                <Button className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>Log Out</Button>
              </InputGroupAddon>

              <NavItem>
                <InputGroupAddon>
                  <Button className='logoutBtn' onClick={() => this.changeLocation()}>{this.state.location}</Button>
                </InputGroupAddon>
              </NavItem>

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
