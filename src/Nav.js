import React from 'react';
import DatePicker from "react-datepicker";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Button, Input, Card, CardTitle } from 'reactstrap';
import Dialog from './components/dialog/editDialog';
import Dialogs from './components/dialog/loaderDialog';
import { Redirect } from 'react-router-dom';
import format from "date-fns/format";
import { Table, Thead, Tr, Tbody, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import MyAutosuggest from './components/autoComplete/autoComplete';
import { updateFlowers, putFlowersCreatedOrderData } from './components/fetch/apiFetch';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { FETCH_URL } from "./components/fetch/url";
import socketIOClient from "socket.io-client";
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';

//CSS
import "./Styles/Nav.css";
import "react-datepicker/dist/react-datepicker.css";

const override = css`
  display: block;
  margin: 0 auto; 
  border-color: red;
`;

const endpoint = FETCH_URL;
const socket = socketIOClient(endpoint);

let printTF = false;
let search = "";
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
      toimituspvm: new Date(),
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
          localStorage.setItem('userLocation', "Tuusjärvi");
          this.setState({ isOpen: false });
          break;
        case "Tuusjärvi":
          localStorage.setItem('userLocation', "Molemmat");
          this.setState({ isOpen: false });
          break;
        case "Molemmat":
          localStorage.setItem('userLocation', "Ryönä");
          this.setState({ isOpen: false });
          break;
        default:
          localStorage.setItem('userLocation', "Ryönä");
          this.setState({ isOpen: false });
          break;
      }
      socket.emit('chat', {
        message: true
      });
    } catch (error) {
      console.log(error);
    };

  }

  async putOrderData(userDatas) {
    try {
      var asiakas = document.getElementById(`kauppa/${userDatas._id}`).value;
      var asiakaslisatieto = this.state.customerInfo;
      var keraysPVM = format(this.state.startDate2, "dd/MM/yyyy");
      var toimitusaika = format(this.state.startDate3, "dd/MM/yyyy");

      await putFlowersCreatedOrderData(asiakas, asiakaslisatieto, toimitusaika, keraysPVM, userDatas);
      await socket.emit('chat', {
        message: true
      });
    } catch (error) {
      console.log(error);
    };
  }

  async putData(userDatas) {
    try {
      let ids = await userDatas.products.map(product => {
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
      socket.emit('chat', {
        message: true
      });
      this.setState({
        isOpen2: false,
        isOpen: false
      })
    } catch (error) {
      console.log(error);
    };
  }

  logOut() {
    try {
      sessionStorage.setItem("userData", '');
      sessionStorage.clear();
      this.setState({
        redirect: true
      });
    } catch (error) {
      console.log(error);
    };
  }

  runAdders() {
    try {
      this.setState({
        dLoader: true
      })
      this.addFlowers()
    } catch (error) {
      console.log(error);
    };
  }

  async getFetchData() {
    try {
      await fetch(FETCH_URL + 'orders/get/id/' + idSafe, {
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
    } catch (error) {
      console.log(error);
    };
  }

  async addFlowers() {
    try {
      let i = 0;
      while (i < this.state.addFlowersValue) {

        await fetch(FETCH_URL + 'products/post', {
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
    } catch (error) {
      console.log(error);
    };
  }

  async addToIDS(_id) {
    try {
      var filteredProducts = this.state.idArray.filter(Boolean);
      await fetch(FETCH_URL + 'orders/post/', {
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
    } catch (error) {
      console.log(error);
    };
  }


  handleChange = (event) => {
    try {
      this.setState({
        [event.target.name]: event.target.value
      });
    } catch (error) {
      console.log(error);
    };
  }

  async addData() {
    try {
      this.setState({
        isOpen2: true,
        dLoader: false
      });
      console.log("f")
      await socket.emit('chat', {
        message: true
      });
    } catch (error) {
      console.log(error);
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

  componentDidMount() {
    try {
      this._isMounted = true;
      var newDate = new Date();

      if (sessionStorage.getItem("btnName") === null) {
        sessionStorage.setItem("btnName", "Kerättävät")
      }

      if (sessionStorage.getItem("siteName") === null) {
        sessionStorage.setItem("siteName", "Kerättävät");
      }

      if (sessionStorage.getItem("userValmis") === null) {
        sessionStorage.setItem("userValmis", "Ei");
      }

      if (sessionStorage.getItem('userDate')) {
        var dateS = sessionStorage.getItem('userDate').split('/');
        newDate = `${dateS[1]}/${dateS[0]}/${dateS[2]}`;


        var result = new Date(newDate);
        result.setDate(result.getDate() + 1);
        this.setState({
          startDate3: result,
          startDate2: new Date(newDate)
        });
      }

      if (sessionStorage.getItem('userDate')) {
        this.setState({
          startDate: new Date(newDate)
        });
      } else
        this.setState({
          startDate: new Date()
        });

      if (localStorage.getItem('userLocation') == null) {
        localStorage.setItem('userLocation', "Ryönä")
      }
    } catch (error) {
      console.log(error);
    };
  }

  handleChange2 = date => {
    try {
      this.setState({
        startDate: date
      });
    } catch (error) {
      console.log(error);
    };
  };

  handleChange3 = date => {
    try {
      this.setState({
        startDate2: date
      });
    } catch (error) {
      console.log(error);
    };
  };

  handleChange4 = date => {
    try {
      this.setState({
        startDate3: date
      });
    } catch (error) {
      console.log(error);
    };
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
      console.log(err);
    };
  }

  async addNewFlowers(_id, products) {
    try {
      if (!this.state.alreadyLoaded) {
        this.state.idArray.push(
          products.map(product => {
            return product._id
          })
        )
      }

      let i = 0;
      while (i < this.state.addFlowersValue) {

        await fetch(FETCH_URL + 'products/post', {
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
    } catch (error) {
      console.log(error);
    };
  }
  addToNewIDS(_id) {
    try {
      var filteredProducts = this.state.idArray.filter(Boolean);
      fetch(FETCH_URL + 'orders/put/id/' + _id, {
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
      socket.emit('chat', {
        message: true
      });
    } catch (err) {
      console.log(err);
    };
  }

  searchInput = (e) => {
    try {
      search = e.target.value;
      let searchChosen = this.state.search;
      this.props.handleSearch(search, searchChosen)
    } catch (err) {
      console.log(err);
    };
  }

  changeSearch() {
    try {
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
    } catch (error) {
      console.log(error);
    };
  }

  handleKey = (e) => {
    try {
      if (e.keyCode === 13) {
        this.props.getTables();
        e.target.value = "";
        search = "";
        this.props.handleSearch(search)
      }
    } catch (error) {
      console.log(error);
    };
  }

  updateSearch() {
    try {
      this.props.getTables();
    } catch (error) {
      console.log(error);
    };
  }

  print() {
    if (printTF) {
      printTF = false;
    } else {
      printTF = true;
    }
    this.props.printData(printTF);
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    return (
      <ErrorBoundary>
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
              <Button name="SearchBtn" className="SearchBTN" color="success" onDoubleClick={() => this.updateSearch()} onClick={() => this.changeSearch()}>^</Button>
              <Input className="SearchInput" placeholder={`Etsi ${this.state.search}`} type="string" onChange={this.searchInput} onKeyDown={this.handleKey} />
            </div>
            <Button className="printBtn" onClick={() => this.print()}></Button>
            <NavbarToggler right className="Toggler" onClick={this.toggle} />
            <NavbarBrand className="navName" href="/main">{sessionStorage.getItem("siteName")}</NavbarBrand>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>

                <Button name="tarkastusBtn" className="TarkastusBTN" onClick={() => this.Tarkastus()}>
                  {sessionStorage.getItem("btnName")}
                </Button>

                <DatePicker className="Datepick"
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

                        <div className="Customer">
                          <MyAutosuggest items={this.props.items2} id={`kauppa/${userDatas._id}`} placeholder={userDatas.kauppa} sendClass={"AutoCompletePropsInput"} getDivClass={"AutoCompletePropsText"} />
                        </div>
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
                                <div className="inputlabelU">
                                  <MyAutosuggest items={this.props.items} id={`kukka/${newData._id}`} placeholder={newData.kukka} sendClass={"AutoCompleteInput"} getDivClass={"AutoCompleteText"} />
                                </div>
                              </Td>

                              <Td>
                                <Input type="number"
                                  name="toimi"
                                  id={`toimi/${newData._id}`}
                                  onChange={this.handleChange}
                                  className="inputlabelU"
                                  placeholder={newData.toimi}>
                                </Input>
                              </Td>

                              <Td>
                                <Input type="select"
                                  name="kerays"
                                  id={`kerays/${newData._id}`}
                                  onChange={this.handleChange}
                                  className="inputlabelU"
                                  placeholder={newData.kerays}>
                                  <option>Ryönä</option>
                                  <option>Tuusjärvi</option>
                                </Input>
                              </Td>

                              <Td>
                                <Input type="text"
                                  name="lisatieto"
                                  id={`lisatieto/${newData._id}`}
                                  onChange={this.handleChange}
                                  className="inputlabelU"
                                  placeholder={newData.lisatieto}>
                                </Input>
                              </Td>
                            </Tr>
                          </Tbody>
                        )}

                      </Table>
                      <Button name="lisaa_kukka" className="addFlower" onClick={() => this.addNewFlowers(userDatas._id, userDatas.products)}>Lisää kukka</Button>
                      <Input type="number"
                        name="addFlowersValue"
                        className="addFlowerInput"
                        max={10}
                        min={1}
                        value={this.state.addFlowersValue}
                        onChange={this.handleChange}>
                      </Input>
                      <Button name="luo_taulukko" onClick={() => this.putData(userDatas) + this.putOrderData(userDatas)}>Luo taulukko</Button>
                    </div>
                  </Card>
                </Dialog>

                <Button name="lisaa_taulukko" className='addBtn' color='primary' type='button' onClick={(e) => this.runAdders()}></Button>
                <Button name="kirjaudu_ulos" className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>Kirjaudu ulos</Button>
                <Button name="location" className='locationBtn' onClick={() => this.changeLocation()}>{localStorage.getItem('userLocation')}</Button>

              </Nav>
            </Collapse>
          </Navbar>
        </div>
      </ErrorBoundary>
    );
  }
}
