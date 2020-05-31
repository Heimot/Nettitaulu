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
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import language from './components/language/language';

//CSS
import "./Styles/Nav.css";
import "react-datepicker/dist/react-datepicker.css";
import { socketConnChat } from './components/socketio/socketio';

const override = css`
  display: block;
  margin: 0 auto; 
  border-color: red;
`;

const override2 = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

let progressValue = false;
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
      search: "kukkia",
      navRed: false,
      loading: false,
      orderInfo: '',
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
      socketConnChat();
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
      var orderLisatieto = this.state.orderInfo;

      await putFlowersCreatedOrderData(asiakas, asiakaslisatieto, toimitusaika, keraysPVM, userDatas, orderLisatieto);
      await socketConnChat();
    } catch (error) {
      console.log(error);
    };
  }

  async putData(userDatas) {
    try {
      this.setState({
        dLoader: true
      })
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
      socketConnChat();
      this.setState({
        isOpen2: false,
        isOpen: false,
        dLoader: false
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
      userDatas =  {
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

          idSafe = json.createdOrder._id

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
        dLoader: false,
        loading: false
      });
      await socketConnChat();
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

      if (sessionStorage.getItem('siteName') !== "Kerättävät") {
        localStorage.setItem('userLocation', 'Molemmat');
      }

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
        sessionStorage.setItem('userDate', format(new Date(newDate), 'dd/MM/yyyy'));
      } else {
        this.setState({
          startDate: new Date()
        });
        sessionStorage.setItem('userDate', format(new Date(), 'dd/MM/yyyy'));
      }
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
          sessionStorage.setItem("userValmis", "Arkistoitu");
          sessionStorage.setItem("siteName", "Arkistoitu");
          sessionStorage.setItem("btnName", "Arkistoitu");
          break;

        case "Arkistoitu":
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
      this.setState({
        loading: true
      })
      if (this.state.alreadyLoaded) {
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
        alreadyLoaded: false,
        addFlowersValue: 1,
      })
      this.addToNewIDS(_id);
    } catch (error) {
      console.log(error);
    };
  }

  async addToNewIDS(_id) {
    try {
      var filteredProducts = this.state.idArray.filter(Boolean);
      await fetch(FETCH_URL + 'orders/put/id/' + _id, {
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
      socketConnChat();
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
        let dataas = true;
        let searchChosen = this.state.search;
        this.props.getTables(dataas);
        this.props.handleSearch(search, searchChosen)
        e.target.value = "";
        search = "";
      }
    } catch (error) {
      console.log(error);
    };
  }

  stopSearch() {
    let dataas = true;
    let search = "";
    let searchChosen = "";
    this.props.handleSearch(search, searchChosen);
    this.props.getTables(dataas);
  }

  updateSearch() {
    try {
      let dataas = true;
      this.props.getTables(dataas);
    } catch (error) {
      console.log(error);
    };
  }

  showDayProgress() {
    if (this.props.progressValue) {
      progressValue = false;
      this.props.showProgress(progressValue);
      this.setState({
        isOpen: !this.state.isOpen
      });
    } else {
      progressValue = true;
      this.props.showProgress(progressValue);
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

  }

  render() {
    let { loading } = this.state;
    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    if (this.state.navRed) {
      return (<Redirect to={'/main'} />)
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
          <Navbar light color={sessionStorage.getItem('siteName') === "Valmiit" ? "success" : sessionStorage.getItem('siteName') === "Arkistoitu" ? "warning" : "info"} fixed="top">

            {!this.state.isOpen ?
              <div className="searchDiv">
                <Button name="SearchBtn" className="SearchBTN" color="success" onDoubleClick={() => this.updateSearch()} onClick={() => this.changeSearch()}>^</Button>
                <Input className="SearchInput" placeholder={`${language[localStorage.getItem('language')].search} ${this.state.search === "kukkia" ? language[localStorage.getItem('language')].navFlowers : language[localStorage.getItem('language')].navKaupat}`} type="string" onChange={this.searchInput} onKeyDown={this.handleKey} />
                <Button name="SearchBtn" className="ReSearchData" color="primary" onClick={() => this.stopSearch()}></Button>
              </div>
              : undefined}

            <NavbarToggler right className="Toggler" onClick={this.toggle} />
            <NavbarBrand className="navName" onClick={() => this.setState({ navRed: true })}>{sessionStorage.getItem("btnName") === "Kerättävät" ? language[localStorage.getItem('language')].navCollect : sessionStorage.getItem("btnName") === "Valmiit" ? language[localStorage.getItem('language')].navReady : language[localStorage.getItem('language')].navArchived}</NavbarBrand>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>

                <Button name="tarkastusBtn" className="TarkastusBTN" disabled={sessionStorage.getItem("userRole") === "Admin" ? false : true} onClick={() => this.Tarkastus()}>
                  {sessionStorage.getItem("btnName") === "Kerättävät" ? language[localStorage.getItem('language')].navCollect : sessionStorage.getItem("btnName") === "Valmiit" ? language[localStorage.getItem('language')].navReady : language[localStorage.getItem('language')].navArchived}
                </Button>

                <DatePicker className="Datepick"
                  selected={this.state.startDate}
                  onChange={this.handleChange2}
                  onCalendarClose={() => sessionStorage.setItem('userDate', format(this.state.startDate, "dd/MM/yyyy"), window.location.reload())}
                  dateFormat="d/MM/yyyy"
                  withPortal
                />
                <Button className="progressBarsButton" disabled={sessionStorage.getItem("userRole") === "Admin" ? false : true} onClick={() => this.showDayProgress()}>{language[localStorage.getItem('language')].navProgressBar}</Button>
                <Dialog isOpen2={this.state.isOpen2} onLoad={loading} onClose={(e) => this.setState({ isOpen2: false, isOpen: false })}>
                  <Card className="AddCard">
                    {
                      loading ?
                        <div className="tableLoaders">
                          <Loader
                            css={override2}
                            height={140}
                            width={16}
                            color={"#123abc"}
                            loading={loading} />
                        </div>
                        : undefined
                    }
                    <div className="DataCard">
                      <div>
                        <CardTitle className="KeraysPVM">{language[localStorage.getItem('language')].navKeraysPVM}</CardTitle>
                        <DatePicker className="AddDate"
                          selected={this.state.startDate2}
                          onChange={this.handleChange3}
                          dateFormat="dd/MM/yyyy"
                        />

                        <CardTitle className="ToimitusPVMText">{language[localStorage.getItem('language')].navToimitusPVM}</CardTitle>
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

                        <Input
                          className="CustomerInfo2"
                          name="orderInfo"
                          placeholder={"Ostotilaus"}
                          onChange={this.handleChange}>
                        </Input>

                        <div className="Customer">
                          <MyAutosuggest items={this.props.items2} id={`kauppa/${userDatas._id}`} placeholder={userDatas.kauppa} sendClass={"AutoCompletePropsInput"} getDivClass={"AutoCompletePropsText"} />
                        </div>
                      </div>

                      <Table>

                        <Thead>
                          <Tr>
                            <Th>{language[localStorage.getItem('language')].tuote}</Th>
                            <Th>{language[localStorage.getItem('language')].kerataan}</Th>
                            <Th>{language[localStorage.getItem('language')].kerayspiste}</Th>
                            <Th>{language[localStorage.getItem('language')].lisatietoa}</Th>
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
                      <Button name="lisaa_kukka" className="addFlower" onClick={() => this.addNewFlowers(userDatas._id, userDatas.products)}>{language[localStorage.getItem('language')].addflower}</Button>
                      <Input type="number"
                        name="addFlowersValue"
                        className="addFlowerInput"
                        max={10}
                        min={1}
                        value={this.state.addFlowersValue}
                        onChange={this.handleChange}>
                      </Input>
                      <Button name="luo_taulukko" onClick={() => this.putData(userDatas) + this.putOrderData(userDatas)}>{language[localStorage.getItem('language')].luotaulukko}</Button>
                    </div>
                  </Card>
                </Dialog>

                <Button name="lisaa_taulukko" disabled={sessionStorage.getItem("userRole") === "Admin" ? false : true} className='addBtn' color='primary' type='button' onClick={() => this.runAdders()}></Button>
                <Button name="kirjaudu_ulos" className='logoutBtn' type='button' color='danger' onClick={() => this.logOut()}>{language[localStorage.getItem('language')].logout}</Button>
                <Button name="location" className='locationBtn' disabled={sessionStorage.getItem('siteName') === "Kerättävät" ? false : true} onClick={() => this.changeLocation()}>{localStorage.getItem('userLocation')}</Button>

              </Nav>
            </Collapse>
          </Navbar>
        </div>
      </ErrorBoundary>
    );
  }
}
