import React from 'react';
import DatePicker from "react-datepicker";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, InputGroupAddon, Button, Input, CardText, CardBlock, Card, CardTitle } from 'reactstrap';
import Dialog from './components/editDialog';
import { Redirect } from 'react-router-dom';
import format from "date-fns/format";
import { Table, Thead, Tr, Tbody, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'


import "./Styles/Nav.css";
import "react-datepicker/dist/react-datepicker.css";

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpen2: false,
      redirect: false,
      redirectToCheck: false,

      kauppa: '',
      customerInfo: '',
      toimituspvm: '',

      nimi1: '',
      maara1: '',
      kerays1: '',
      lisatieto1: '',

      nimi2: '',
      maara2: '',
      kerays2: '',
      lisatieto2: '',

      nimi3: '',
      maara3: '',
      kerays3: '',
      lisatieto3: '',

      nimi4: '',
      maara4: '',
      kerays4: '',
      lisatieto4: '',

      nimi5: '',
      maara5: '',
      kerays5: '',
      lisatieto5: '',

      location: 'Tuusjärvi',
      isLoading: true,
      startDate: null,
      dateValue: null,
      startDate2: new Date(),
      startDate3: new Date()
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
  }

  addData() {
    this.setState({
      isOpen2: true
    });
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
        toimituspvm: format(this.state.startDate3, "dd/MM/yyyy"),
        alisatieto: this.state.customerInfo,
        kukka: {
          kukka1: {
            name: this.state.nimi1,
            toimi: this.state.maara1,
            kerays: this.state.kerays1,
            lisatieto: this.state.lisatieto1,
          },
          kukka2: {
            name: this.state.nimi2,
            toimi: this.state.maara2,
            kerays: this.state.kerays2,
            lisatieto: this.state.lisatieto2,
          },
          kukka3: {
            name: this.state.nimi3,
            toimi: this.state.maara3,
            kerays: this.state.kerays3,
            lisatieto: this.state.lisatieto3,
          },
          kukka4: {
            name: this.state.nimi4,
            toimi: this.state.maara4,
            kerays: this.state.kerays4,
            lisatieto: this.state.lisatieto4,
          },
          kukka5: {
            name: this.state.nimi5,
            toimi: this.state.maara5,
            kerays: this.state.kerays5,
            lisatieto: this.state.lisatieto5,
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
    var result = this.state.startDate3;
    result.setDate(result.getDate() + 1);
    this.setState({
      startDate3: result
    });

    if (sessionStorage.getItem('userDate')) {
      this.setState({
        dateValue: sessionStorage.getItem('userDate'),
        startDate: new Date()
      });
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

  handleChange4 = date => {
    this.setState({
      startDate3: date
    });
  };

  Tarkastus() {
    this.setState({
      redirectToCheck: true
    })
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    if (this.state.redirectToCheck) {
      return (<Redirect to={'/checked'} />)
    }
    return (
      <div>
        <Navbar light color="info" fixed="top">
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">React</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>

              <Button className="TarkastusBTN" onClick={() => this.Tarkastus()}>
                Tarkastus
                </Button>

              <DatePicker className="Datepicker"
                value={this.state.dateValue}
                selected={this.state.startDate}
                onChange={this.handleChange2}
                onCalendarClose={() => sessionStorage.setItem('userDate', format(this.state.startDate, "dd/MM/yyyy"), window.location.reload())}
                dateFormat="d/MM/yyyy"
                withPortal
              />

              <Input className="SearchInput" placeholder="Kukan nimi" id="number" type="string" onChange={(evt) => { global.nimi11 = evt.target.value; }} />
              <Button className="SearchBTN">Search</Button>

              <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
                <Card className="AddCard">

                  <div className="DataCard">
                    <div>
                      <CardTitle className="KeraysPVM">Keräyspäivämäärä</CardTitle>
                      <DatePicker className="AddDate"
                        selected={this.state.startDate2}
                        onChange={this.handleChange3}
                        dateFormat="dd/MM/yyyy"
                      />

                      <CardTitle className="ToimitusPVMText">Toimituspäivämäärä</CardTitle>
                      <DatePicker className="ToimitusPVM"
                        selected={this.state.startDate3}
                        onChange={this.handleChange4}
                        dateFormat="dd/MM/yyyy"
                      />

                      <Input
                        className="CustomerInfo"
                        type="textarea"
                        name="customerInfo"
                        placeholder="Asiakkaan lisätiedot"
                        onChange={this.handleChange}>
                      </Input>

                      <Input name="kauppa"
                        onChange={this.handleChange}
                        placeholder={'Kaupan nimi'}>
                      </Input>
                    </div>

                    <Table>

                      <Thead>
                        <Tr>
                          <Th>Tuote</Th>
                          <Th>Kerätään</Th>
                          <Th>Keräyspiste</Th>
                          <Th>Lisätietoa</Th>
                        </Tr>
                      </Thead>

                      {/*1 taulukkomuokkaus*/}
                      <Tbody>
                        <Tr>

                          <Td >
                            <Input type="text"
                              name="nimi1"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Nimi"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="number"
                              name="maara1"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Määrä"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="kerays1"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Keräyspiste"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="lisatieto1"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Lisätietoa"}>
                            </Input>
                          </Td>
                        </Tr>

                        {/*2 taulukkomuokkaus*/}

                        <Tr>

                          <Td >
                            <Input type="text"
                              name="nimi2"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Nimi"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="number"
                              name="maara2"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Määrä"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="kerays2"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Keräyspiste"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="lisatieto2"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Lisätietoa"}>
                            </Input>
                          </Td>
                        </Tr>

                        {/*3 taulukkomuokkaus*/}

                        <Tr>

                          <Td >
                            <Input type="text"
                              name="nimi3"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Nimi"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="number"
                              name="maara3"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Määrä"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="kerays3"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Keräyspiste"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="lisatieto3"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Lisätietoa"}>
                            </Input>
                          </Td>
                        </Tr>

                        {/*4 taulukkomuokkaus*/}

                        <Tr>

                          <Td >
                            <Input type="text"
                              name="nimi4"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Nimi"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="number"
                              name="maara4"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Määrä"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="kerays4"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Keräyspiste"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="lisatieto4"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Lisätietoa"}>
                            </Input>
                          </Td>
                        </Tr>

                        {/*5 taulukkomuokkaus*/}

                        <Tr>

                          <Td >
                            <Input type="text"
                              name="nimi5"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Nimi"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="number"
                              name="maara5"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Määrä"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="kerays5"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Keräyspiste"}>
                            </Input>
                          </Td>

                          <Td>
                            <Input type="text"
                              name="lisatieto5"
                              onChange={this.handleChange}
                              className="inputlabel"
                              placeholder={"Lisätietoa"}>
                            </Input>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    <Button onClick={() => this.postData()}>Luo uusi</Button>
                  </div>
                </Card>
              </Dialog>

              <Button className='addBtn' color='primary' type='button' onClick={(e) => this.addData()}></Button>
              <Button className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>Kirjaudu ulos</Button>
              <Button className='locationBtn' onClick={() => this.changeLocation()}>{this.state.location}</Button>

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
