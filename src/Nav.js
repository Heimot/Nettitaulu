import React from 'react';
import DatePicker from "react-datepicker";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Button, Input, Card, CardTitle } from 'reactstrap';
import Dialog from './components/fetch/dialog/editDialog';
import Dialogs from './components/fetch/dialog/loaderDialog';
import { Redirect } from 'react-router-dom';
import format from "date-fns/format";
import { Table, Thead, Tr, Tbody, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { updateFlowers, putFlowersCreatedOrderData } from './components/fetch/apiFetch';
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
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpen2: false,
      redirect: false,
      redirectToCheck: false,
      siteName: sessionStorage.getItem("siteName"),
      btnName: sessionStorage.getItem("btnName"),

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
      date: new Date(),
      _id: '',
      dLoader: false,
      testLoader: true,
      search: "kukkia"
    };
    this.toggle = this.toggle.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  changeLocation() {
    try {
      switch (localStorage.getItem('userLocation')) {
        case "Ryönä":
          localStorage.setItem('userLocation', "Tuusjärvi")
          break;
        case "Tuusjärvi":
          localStorage.setItem('userLocation', "Molemmat")
          break;
        case "Molemmat":
          localStorage.setItem('userLocation', "Ryönä")
          break;
        default:
          localStorage.setItem('userLocation', "Ryönä")
          break;
      }
      this.props.getTables();
    } catch (err) {
    }

  }

  async putOrderData(userDatas) {
    try {
      var asiakas = this.state.kauppa;
      var asiakaslisatieto = this.state.customerInfo;
      var keraysPVM = format(this.state.startDate2, "dd/MM/yyyy");
      var toimitusaika = format(this.state.startDate3, "dd/MM/yyyy");

      await putFlowersCreatedOrderData(asiakas, asiakaslisatieto, toimitusaika, keraysPVM, userDatas);
      await this.props.getTables();
    } catch (err) {
    }
  }

  async putData(userDatas) {
    try {
      let ids = await userDatas.products.map(product => {
        return product._id
      })
      console.log(ids)

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
    } catch (err) {
    }
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
        userDatas = json;

      })
      .catch((error) => {
        console.log(error);
      });
    await this.addData();

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
        date: sessionStorage.getItem("userDate"),
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
    this.setState({
      idArray: []
    });
    filteredProducts = [];
    this.getFetchData();
  }


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async addData() {
    this.setState({
      isOpen2: true,
      dLoader: false
    });
    console.log("f")
    await this.props.getTables();
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    this._isMounted = true;

    if (sessionStorage.getItem("btnName") === null) {
      sessionStorage.setItem("btnName", "Kerättävät")
    }

    if (sessionStorage.getItem("siteName") === null) {
      sessionStorage.setItem("siteName", "Kerättävät");
    }

    if (sessionStorage.getItem("userValmis") === null) {
      sessionStorage.setItem("userValmis", "Ei");
    }

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

    if (localStorage.getItem('userLocation') == null) {
      localStorage.setItem('userLocation', "Ryönä")
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

  async Tarkastus() {
    try {
      switch (sessionStorage.getItem("userValmis")) {
        case "Ei":
          sessionStorage.setItem("userValmis", "Kerätty");
          sessionStorage.setItem("siteName", "Valmiit");
          sessionStorage.setItem("btnName", "Valmiit");
          break;
        case "Kerätty":
          sessionStorage.setItem("userValmis", "Ei");
          sessionStorage.setItem("siteName", "Kerättävät");
          sessionStorage.setItem("btnName", "Kerättävät");
          break;
        default:
          sessionStorage.setItem("userValmis", "Ei");
          sessionStorage.setItem("siteName", "Kerättävät");
          sessionStorage.setItem("btnName", "Kerättävät");
          break;
      }
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
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
      alreadyLoaded: true,
      addFlowersValue: 1,
    })
    this.addToNewIDS(_id);
  }
  addToNewIDS(_id) {
    try {
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
      this.getFetchData();
      this.props.getTables();
    } catch (err) {
      console.log("error skipped")
    }
  }

  searchInput = (e) => {
    try {
      let search = e.target.value;
      let searchChosen = this.state.search;
      this.props.getSearch(search, searchChosen)
    } catch (err) {
      console.log(err)
    }
  }

  changeSearch() {
    switch (this.state.search) {
      case "kukkia":
        this.setState({
          search: "kauppoja"
        })
        break;
      case "kauppoja":
        this.setState({
          search: "kukkia"
        })
        break;
      default:
        this.setState({
          search: "kukkia"
        })
        break;
    }
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    return (
      <div>
        <Dialogs isOpen={this.state.dLoader}>
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
          <div className="searchDiv">
            <Button className="SearchBTN" color="success" onClick={() => this.changeSearch()}>^</Button>
            <Input className="SearchInput" placeholder={`Etsi ${this.state.search}`} type="string" onChange={this.searchInput} />
          </div>
          <NavbarToggler right className="Toggler" onClick={this.toggle} />
          <NavbarBrand className="navName" href="/main">{sessionStorage.getItem("siteName")}</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>

              <Button className="TarkastusBTN" onClick={() => this.Tarkastus()}>
                {sessionStorage.getItem("btnName")}
              </Button>

              <DatePicker className="Datepicker"
                value={this.state.dateValue}
                selected={this.state.startDate}
                onChange={this.handleChange2}
                onCalendarClose={() => sessionStorage.setItem('userDate', format(this.state.startDate, "dd/MM/yyyy"), window.location.reload())}
                dateFormat="d/MM/yyyy"
                withPortal
              />


              <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false, isOpen: false })}>
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
                        <Tbody key={newData._id}>
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
                    <Button onClick={() => this.putData(userDatas) + this.putOrderData(userDatas)}>Luo taulukko</Button>
                  </div>
                </Card>
              </Dialog>

              <Button className='addBtn' color='primary' type='button' onClick={(e) => this.runAdders()}></Button>
              <Button className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>Kirjaudu ulos</Button>
              <Button className='locationBtn' onClick={() => this.changeLocation()}>{localStorage.getItem('userLocation')}</Button>

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
