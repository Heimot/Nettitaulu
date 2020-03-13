import React from 'react';
import DatePicker from "react-datepicker";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Button, Input, Card, CardTitle, CardText } from 'reactstrap';
import Dialog from './components/fetch/dialog/editDialog';
import Dialogs from './components/fetch/dialog/loaderDialog';
import { Redirect } from 'react-router-dom';
import format from "date-fns/format";
import { Table, Thead, Tr, Tbody, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { updateFlowers, putFlowersOrderData } from './components/fetch/apiFetch';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";

import "./Styles/Nav.css";
import "react-datepicker/dist/react-datepicker.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

let idSafe = "";
let userDatas = {
  valmis: 0,
  products: [
    {
      kukka: "anti crash technology 100000000 ;(",
      toimi: 58,
      kerays: "no crash",
      lisatieto: "Im bad at making these not crash",
      _id: "no id",

    }
  ],
  _id: "no id",
  kauppa: "anti crash technology v10000 by joonas",
  alisatieto: "anti crash",
  date: "f",
  toimituspvm: "f",
};

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpen2: false,
      redirect: false,
      redirectToCheck: false,
      siteName: 'Keräykseen',
      btnName: 'Valmiit',

      kauppa: '',
      customerInfo: '',
      toimituspvm: '',

      kukka: '',
      toimi: '',
      kerays: '',
      lisatieto: '',

      alreadyLoaded: false,
      idArray: [],
      addFlowersValue: 1,

      location: 'Tuusjärvi',
      locationName: '',
      isLoading: true,
      startDate: null,
      dateValue: null,
      startDate2: new Date(),
      startDate3: new Date(),
      toimituspvm: new Date(),
      date: new Date(),
      _id: '',
      updtData: [],
      dLoader: false
    };
    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  changeLocation() {
    if (localStorage.getItem('userLocation') !== "Tuusjärvi" && localStorage.getItem('userLocation') !== "Ryönä") {
      this.setState({
        location: 'Tuusjärvi',
        locationName: "Molemmat",
        isLoading: false
      });
      localStorage.setItem("userLocation", this.state.location);
      window.location.reload()

    } else if (localStorage.getItem('userLocation') !== "Ryönä") {
      this.setState({
        location: 'Ryönä',
        locationName: "Ryönä",
        isLoading: false
      });
      localStorage.setItem("userLocation", this.state.location);
      window.location.reload()

    } else if (localStorage.getItem('userLocation') !== "Molemmat") {
      this.setState({
        location: 'Molemmat',
        locationName: "Tuusjärvi",
        isLoading: false
      });
      localStorage.setItem("userLocation", this.state.location);
      window.location.reload()

    }

  }

  putOrderData(_id, kauppa, alisatieto, toimituspvm) {
    var asiakas = this.state.kauppa;
    var asiakaslisatieto = this.state.customerInfo;
    var toimitusaika = this.state.ToimitusPVM;

    putFlowersOrderData(asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id);
    this.props.getTables();
  }

  async putData(userDatas) {

      let ids =  await userDatas.products.map(product => {
          return product._id
        })

    let i = 0;
    while (i < ids.length) {
      let id = ids.shift();
      var kukka = document.getElementById(`kukka/${id}`).value;
      var toimi = document.getElementById(`toimi/${id}`).value;
      var kerays = document.getElementById(`kerays/${id}`).value;
      var lisatieto = document.getElementById(`lisatieto/${id}`).value;

      await updateFlowers(userDatas, id, kukka, toimi, kerays, lisatieto);
    }
    this.props.getTables();
    this.setState({
      isOpen2: false,
      isOpen: false
    })
  }

  logOut() {
    sessionStorage.setItem("userData", '');
    sessionStorage.clear();
    this.setState({
      redirect: true
    });
  }

  runAdders() {
    this.setState({
      dLoader: true
    })
    this.addFlowers()
  }

  async getFetchData() {
    await fetch('http://localhost:3002/orders/get/id/' + idSafe, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          updtData: json
        })
        userDatas = json;
        console.log(this.state.updtData)

      })
      .catch((error) => {
        console.log(error);
      });
    this.addData();
    this.props.getTables();
  }

  async addFlowers() {
    let i = 0;
    while (i < this.state.addFlowersValue) {

      await fetch('http://localhost:3002/products/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);

          let jsonID = json.createdProduct._id;
          this.state.idArray.push(jsonID)

          this.setState({
            idArray: this.state.idArray.toString().split(",")
          })
        })
        .catch((error) => {
          console.log(error);
        });
      i++;
    }
    this.setState({
      alreadyLoaded: true
    })
    this.addToIDS();
  }

  async addToIDS(_id) {
    var filteredProducts = this.state.idArray.filter(Boolean);
    await fetch('http://localhost:3002/orders/post/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        kauppa: "Vakio",
        alisatieto: "",
        date: format(this.state.date, 'dd/MM/yyyy'),
        toimituspvm: format(this.state.toimituspvm, 'dd/MM/yyyy'),
        products: filteredProducts
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);

        idSafe = json.createdOrder.id_

      })
      .catch((error) => {
        console.log(error);
      });
    sessionStorage.removeItem('userDate2');
    this.setState({
      idArray: []
    });
    filteredProducts = [];
    this.getFetchData()
  }


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addData() {
    this.setState({
      isOpen2: true,
      dLoader: false
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
        this.setState({
          isOpen: false
        })
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

    if (localStorage.getItem('userLocation') !== "Tuusjärvi" && localStorage.getItem('userLocation') !== "Ryönä") {
      this.setState({
        location: 'Tuusjärvi',
        locationName: "Molemmat",
        isLoading: false
      });
    } else if (localStorage.getItem('userLocation') !== "Ryönä") {
      this.setState({
        location: 'Ryönä',
        locationName: "Ryönä",
        isLoading: false
      });
    } else if (localStorage.getItem('userLocation') !== "Molemmat") {
      this.setState({
        location: 'Molemmat',
        locationName: "Tuusjärvi",
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

  async addNewFlowers(_id, products) {
    if (!this.state.alreadyLoaded) {
      this.state.idArray.push(
        products.map(product => {
          return product._id
        })
      )
    }

    let i = 0;
    while (i < this.state.addFlowersValue) {

      await fetch('http://localhost:3002/products/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
        },
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);

          let jsonID = json.createdProduct._id;
          this.state.idArray.push(jsonID)
          console.log(this.state.idArray);

          this.setState({
            idArray: this.state.idArray.toString().split(",")
          })
        })
        .catch((error) => {
          console.log(error);
        });
      i++;
    }
    this.setState({
      alreadyLoaded: true
    })
    this.addToNewIDS(_id);
  }

  addToNewIDS(_id) {
    var filteredProducts = this.state.idArray.filter(Boolean);
    fetch('http://localhost:3002/orders/put/id/' + _id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
      body: JSON.stringify({
        products: filteredProducts
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
    sessionStorage.removeItem('userDate2');
    this.getFetchData();
    this.props.getTables();
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
        <Dialogs isOpen2={this.state.dLoader}>
            <div className="Spinner">
              <Loader
                css={override}
                height={140}
                width={16}
                color={"#123abc"}
                loading={this.state.dLoader}
              />
              </div>
            </Dialogs>
        <Navbar light color="info" fixed="top">
          <NavbarToggler right className="Toggler" onClick={this.toggle} />
          <NavbarBrand href="/">{this.state.siteName}</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>

              <Button className="TarkastusBTN" onClick={() => this.Tarkastus()}>
                {this.state.btnName}
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

              <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false, isOpen: false })}>
                <Card className="AddCard">

                  <div className="DataCard">
                    <div>
                      <CardTitle className="KeraysPVM">Keräyspäivämäärä</CardTitle>
                      <DatePicker className="AddDate"
                        selected={this.state.date}
                        onChange={this.handleChange3}
                        dateFormat="dd/MM/yyyy"
                      />

                      <CardTitle className="ToimitusPVMText">Toimituspäivämäärä</CardTitle>
                      <DatePicker className="ToimitusPVM2"
                        selected={this.state.startDate3}
                        onChange={this.handleChange4}
                        dateFormat="dd/MM/yyyy"
                      />

                      <Input
                        className="CustomerInfo"
                        type="textarea"
                        name="customerInfo"
                        placeholder={userDatas.alisatieto}
                        onChange={this.handleChange}>
                      </Input>

                      <Input name="kauppa"
                        onChange={this.handleChange}
                        placeholder={userDatas.kauppa}>
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

                      {userDatas.products.map(newData =>
                        <Tbody>
                          <Tr>

                            <Td >
                              <Input type="text"
                                name="kukka"
                                id={`kukka/${newData._id}`}
                                onChange={this.handleChange}
                                className="inputlabel"
                                placeholder={newData.kukka}>
                              </Input>
                            </Td>

                            <Td>
                              <Input type="number"
                                name="toimi"
                                id={`toimi/${newData._id}`}
                                onChange={this.handleChange}
                                className="inputlabel"
                                placeholder={newData.toimi}>
                              </Input>
                            </Td>

                            <Td>
                              <Input type="text"
                                name="kerays"
                                id={`kerays/${newData._id}`}
                                onChange={this.handleChange}
                                className="inputlabel"
                                placeholder={newData.kerays}>
                              </Input>
                            </Td>

                            <Td>
                              <Input type="text"
                                name="lisatieto"
                                id={`lisatieto/${newData._id}`}
                                onChange={this.handleChange}
                                className="inputlabel"
                                placeholder={newData.lisatieto}>
                              </Input>
                            </Td>
                          </Tr>
                        </Tbody>
                      )}

                    </Table>
                    <Button className="addFlower" onClick={() => this.addNewFlowers(userDatas._id, userDatas.products)}>Lisää kukka</Button>
                    <Input type="number"
                      name="addFlowersValue"
                      className="addFlowerInput"
                      max={10}
                      min={1}
                      value={this.state.addFlowersValue}
                      onChange={this.handleChange}>
                    </Input>
                    <Button onClick={() => this.putData(userDatas)}>Luo taulukko</Button>
                  </div>
                </Card>
              </Dialog>

              <Button className='addBtn' color='primary' type='button' onClick={(e) => this.runAdders()}></Button>
              <Button className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>Kirjaudu ulos</Button>
              <Button className='locationBtn' onClick={() => this.changeLocation()}>{this.state.locationName}</Button>

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
