import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardText, CardTitle, Button, Input } from 'reactstrap';
import Dialog from './components/dialog/editDialog';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { deleteFlowerData, patchKeraysData, putFlowersOrderData, patchValmiusProductsData, patchValmiusData, updateFlowersEdit } from './components/fetch/apiFetch';
import MyAutosuggest from "./components/autoComplete/autoComplete";
import { FETCH_URL } from "./components/fetch/url";
import XLSX from 'xlsx';
import socketIOClient from "socket.io-client";
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';

//CSS files
import "./Styles/Table.css";
import "./Styles/progressBar.css";

let change = false;
var arr = [];

function changeData() {
  try {
    change = true;
  } catch (error) {
    console.log(error);
  };
}

function changeNormal() {
  try {
    change = false;
  } catch (error) {
    console.log(error);
  };
}

const Progress = ({ done, count, counter, id }) => {
  try {
    let data = change === false ? done = done ? done + "%" : "" : count === undefined ? "" : `${count}/${counter}`;
    if (data.includes('.')) {
      data = data.substring(0, data.indexOf(".")) + "%";
    }
    const [style, setStyle] = React.useState({});


    setTimeout(() => {
      const newStyle = {
        opacity: 1,
        width: `${done}`
      }
      setStyle(newStyle);
    }, 100);

    return (
      <div className="progress" onMouseEnter={() => changeData()} onMouseLeave={() => changeNormal()}>
        <div className={(((done === "100%" || count === counter) && id === "Kerätty") || (count === counter && id === "Kerätty") ? "progress-ready" : "progress-needed" && id === "Ei ole" ? "progress-cantbedone" : "progress-needed")} style={style}>
          <div className="dataFont">
            {data}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.log(error);
  };
}

const endpoint = FETCH_URL;
const socket = socketIOClient(endpoint);

class PeopleCard extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      changedProp: "",
      sent: false,
      search: "",
      suggestions: [],
      printData: [],

      response: false,
      endpoint: 'http://localhost:3002',

      kauppa: '',
      customerInfo: '',
      ToimitusPVM: '',
      idArray: [],

      isOpen: false,
      isOpen2: false,

      location: '',
      date: sessionStorage.getItem('userDate'),
      startDate: new Date(),
      startDate2: new Date(),
      createdID: '',
      idf: [],
      addFlowersValue: 1,

      openWarning: false,
      valmisWarning: false,
      alreadyLoaded: false,
    }
  }

  muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm) {
    try {
      var dateS = date.split('/');
      var newDate = `${dateS[1]}/${dateS[0]}/${dateS[2]}`;

      var dateSp = toimituspvm.split('/');
      var newToimitusPVM = `${dateSp[1]}/${dateSp[0]}/${dateSp[2]}`;
      this.setState({
        startDate: new Date(newDate),
        startDate2: new Date(newToimitusPVM),
        isOpen2: true,
      })
    } catch (error) {
      console.log(error);
    };
  }

  warning() {
    try {
      this.setState({
        openWarning: true,
      })
    } catch (error) {
      console.log(error);
    };
  }

  valmis() {
    try {
      this.setState({
        valmisWarning: true,
      })
    } catch (error) {
      console.log(error);
    };
  }

  async valmisData(_id, products) {
    try {
      let ids = [];
      let valmius;
      let valmius2;
      let location = "";
      let i = 0;
      let p = 0;
      let id;

      let valmiukset = await products.map(product => {
        return product.valmis
      })
      let eivalmiit = valmiukset.filter(valmiit => {
        return valmiit === "Ei"
      })
      let valmiit = valmiukset.filter(valmiit => {
        return valmiit === "Kerätty"
      })

      if (eivalmiit.length > valmiit.length) {

        valmius = "Kerätty";
        valmius2 = "Kyllä";
        switch (localStorage.getItem("userLocation")) {
          case "Tuusjärvi":
            location = "tuusjarvi";
            patchValmiusData(valmius2, _id, location);
            break;

          case "Ryönä":
            location = "ryona";
            patchValmiusData(valmius2, _id, location);
            break;

          case "Molemmat":
            while (p < 2) {
              if (p === 0) {
                location = "ryona";
                patchValmiusData(valmius2, _id, location);
                p++;
              } else if (p === 1) {
                location = "tuusjarvi";
                patchValmiusData(valmius2, _id, location);
                p++;
              }
            }
            break;
          default:
            // ...
            break;
        }
        ids = await products.map(product => {
          return product._id
        })

        i = 0;
        while (i < ids.length) {
          id = ids.shift();
          await patchValmiusProductsData(id, valmius)
        }
        i++;
      } else {

        valmius = "Ei";
        valmius2 = "Ei";
        switch (localStorage.getItem("userLocation")) {
          case "Tuusjärvi":
            location = "tuusjarvi"
            patchValmiusData(valmius2, _id, location)
            break;

          case "Ryönä":
            location = "ryona"
            patchValmiusData(valmius2, _id, location)
            break;

          case "Molemmat":
            while (p < 2) {
              if (p === 0) {
                location = "ryona";
                patchValmiusData(valmius2, _id, location);
                p++;
              } else if (p === 1) {
                location = "tuusjarvi";
                patchValmiusData(valmius2, _id, location);
                p++;
              }
            }
            break;

          default:
            // ...
            break;
        }

        ids = await products.map(product => {
          return product._id
        })
        i = 0;
        while (i < ids.length) {
          id = ids.shift();
          await patchValmiusProductsData(id, valmius)
        }
        i++;
      }
      this.setState({
        valmisWarning: false
      })
      socket.emit('chat', {
        message: true
      });
    } catch (err) {
      console.log(err);
    };
  }

  async addFlowers(_id, products) {
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
          body: JSON.stringify({
            kerays: localStorage.getItem("userLocation")
          }),
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
      this.addToIDS(_id);
    } catch (error) {
      console.log(error);
    };
  }

  addToIDS(_id) {
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
      socket.emit('chat', {
        message: true
      });
    } catch (error) {
      console.log(error);
    };
  }

  patchData(product) {
    try {
      const idvalues = document.getElementById(`keratty/${product._id}`).value;
      var maara = document.getElementById(product._id).value;
      patchKeraysData(product, idvalues, maara);
      socket.emit('chat', {
        message: true
      });

      var timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 5000)
    } catch (error) {
      console.log(error);
    };
  }

  async putFlowersIData(products, _id, kauppa, alisatieto, toimituspvm, date) {
    try {
      let ids = await products.map(product => {
        return product._id
      })

      let i = 0;
      while (i < ids.length) {
        let id = ids.shift();
        var kukka = document.getElementById(`kukka/${id}`).value;
        var toimi = document.getElementById(`toimi/${id}`).value;
        var kerays = document.getElementById(`kerays/${id}`).value;
        var lisatieto = document.getElementById(`lisatieto/${id}`).value;

        await updateFlowersEdit(products, id, kukka, toimi, kerays, lisatieto);
      }
      socket.emit('chat', {
        message: true
      });
      this.putOrderData(_id, kauppa, alisatieto, toimituspvm, date)
    } catch (error) {
      console.log(error);
    };
  }

  async putOrderData(_id, kauppa, alisatieto, toimituspvm, date) {
    try {
      var asiakas = document.getElementById(`kauppa/${_id}`).value;
      var asiakaslisatieto = this.state.customerInfo;
      var toimitusaika = this.state.ToimitusPVM;
      var keraysPVM = format(this.state.startDate, "dd/MM/yyyy");

      await putFlowersOrderData(asiakas, asiakaslisatieto, toimitusaika, kauppa, alisatieto, toimituspvm, _id, keraysPVM, date);
      await socket.emit('chat', {
        message: true
      });
      this.setState({
        isOpen2: false
      })
    } catch (error) {
      console.log(error);
    };
  }

  deleteData(product) {
    try {
      document.getElementById(`kukka/${product._id}`).value = null;
      document.getElementById(`toimi/${product._id}`).value = null;
      document.getElementById(`lisatieto/${product._id}`).value = null;
      deleteFlowerData(product);
      socket.emit('chat', {
        message: true
      });
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

  pvmMuutos = (date) => {
    try {
      this.setState({
        startDate: date
      });
    } catch (error) {
      console.log(error);
    };
  }

  toimituspvmMuutos = (date) => {
    try {
      this.setState({
        startDate2: date,
        ToimitusPVM: format(date, 'dd/MM/yyyy')
      });
    } catch (error) {
      console.log(error);
    };
  }

  jsonToExcel(products, _id) {
    try {
      var fileName = "EXCEL"
      var workSheet = XLSX.utils.json_to_sheet(products);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, workSheet, fileName);

      XLSX.writeFile(wb, _id + ".xlsx")
    } catch (error) {
      console.log(error);
    };
  }

  printOut(product, kauppa) {
    if (product.keratty === "Odottaa keräystä") {
      arr.push({
        kauppa: kauppa,
        tuote: product.kukka,
        maara: product.toimi,
        lisatieto: product.lisatieto
      });

      this.setState({
        printData: arr
      })
      this.props.printDataArr(arr)
    }
  }

  componentDidMount() {
    try {
      this._isMounted = true;

      var result = this.state.startDate2;
      result.setDate(result.getDate() + 1);
      this.setState({
        startDate2: result,
        location: localStorage.getItem("userLocation"),
        changedProp: this.props.search
      });

      if (this.state.date) {
      } else {
        this.setState({
          date: this.state.startDate
        })
        sessionStorage.setItem("userDate", format(new Date(), 'dd/MM/yyyy'));
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    };
  }

  render() {
    let { tuusjarvi, ryona, _id, products, kauppa, date, alisatieto, toimituspvm } = this.props.person;

    let array = [];
    let result = {};
    let counts = {};
    array.push(
      products.map(doc => {
        return doc.keratty;
      })
    )
    Object.keys(result).map(key => ({ [key]: result[key] }))
    for (let i = 0; i < array.length; i++) {
      result[array[i]] = (result[array[i]] || 0) + 1
    }
    Object.keys(result).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

    return (
      <ErrorBoundary>
        <div className="myDiv">
          <div className="NavBlock"></div>
          <div>
            <Card className="Cards">
              <CardTitle>{date}</CardTitle>
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardTitle>ToimitusPVM: {toimituspvm}</CardTitle> : undefined}
              <CardTitle>{kauppa}</CardTitle>
              <CardText>{_id}</CardText>
              <CardText className="lisatieto">{alisatieto}</CardText>
              <CardText></CardText>
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardText>Tarkastettu Ryönä: {ryona}</CardText> : undefined}
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardText>Tarkastettu Tuusjärvi: {tuusjarvi}</CardText> : undefined}
              <div className="loaders" >
                <div className="loaderMargins">
                  <CardText className="hover">Odottaa keräystä</CardText>
                  <Progress done={100 * Math.abs(counts.Odottaakeräystä / Object.keys(result).toString().split(",").length)} count={counts.Odottaakeräystä} counter={products.length} id={"Odottaa keräystä"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">Keräyksessä</CardText>
                  <Progress done={100 * Math.abs(counts.Keräyksessä / Object.keys(result).toString().split(",").length)} count={counts.Keräyksessä} counter={products.length} id={"Keräyksessä"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">Kerätty</CardText>
                  <Progress done={100 * Math.abs(counts.Kerätty / Object.keys(result).toString().split(",").length)} count={counts.Kerätty} counter={products.length} id={"Kerätty"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">Ei ole</CardText>
                  <Progress done={100 * Math.abs(counts.Eiole / Object.keys(result).toString().split(",").length)} count={counts.Eiole} counter={products.length} id={"Ei ole"} />
                </div>
              </div>

              <Table className="Tables">

                <Thead>
                  <Tr>
                    <Th>Tuote</Th>
                    <Th>Kerätään</Th>
                    <Th>Keräyspiste</Th>
                    <Th>Lisätietoa</Th>
                    <Th>Keräämässä</Th>
                    <Th>Kerättymäärä</Th>
                  </Tr>
                </Thead>

                {products.map(product =>
                  <Tbody key={product._id}>
                    <Tr>
                      <Td className="KukkaTable">{product.kukka}</Td>
                      <Td>{product.toimi}</Td>
                      <Td>{product.kerays}</Td>
                      <Td className="lisatietoTable">{product.lisatieto}</Td>
                      <Td>
                        <Input className="keraamassaBtn"
                          type="button"
                          id={`keratty/${product._id}`}
                          value={product.keratty}
                          placeholder={product.keratty}
                          onClick={() => this.patchData(product) + this.printOut(product, kauppa)}>
                        </Input>
                      </Td>
                      <Td>
                        <Input className="kerattyMaara"
                          type="number"
                          id={product._id}
                          placeholder={product.kerattymaara}
                          name="kerattymaara">
                        </Input>
                      </Td>
                    </Tr>
                  </Tbody>
                )}
              </Table>
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="valmisBtn" className="valmisBtn" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="success" onClick={() => this.valmis()}>Valmis</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="muokkaaBtn" className="muokkaaBtn" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="primary" onClick={() => this.muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm)}>Muokkaa</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="poistaBtn" className="poistaBtn" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="danger" onClick={() => this.warning()}>Poista</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="vieExcel" className="vieExcel" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="info" onClick={() => this.jsonToExcel(products, _id)}>Vie Exceliin</Button> : undefined}
            </Card>

            <Dialog className="DelWarn" isOpen2={this.state.openWarning} onClose={(e) => this.setState({ openWarning: false })}>

              <Card className="Cards">

                <CardTitle className="warningBox">Haluatko poistaa tämän taulun?</CardTitle>
                <CardText className="warningBox">ID: {_id}</CardText>
                <CardText className="warningBox">KAUPPA: {kauppa}</CardText>
                <CardText className="warningBox">KERÄYSPÄIVÄMÄÄRÄ: {date}</CardText>
                <CardText className="warningBox">TOIMITUSPÄIVÄMÄÄRÄ: {toimituspvm}</CardText>
                <CardText className="warningBox">KUKKIEN MÄÄRÄ: {products.length}</CardText>

                <Button name="delete_kylla" className="dialogBtn" color="success" onClick={() => this.props.removePerson(_id, products) + this.setState({ openWarning: false })}>Kyllä</Button>
                <Button name="delete_ei" className="dialogBtn" color="danger" onClick={() => this.setState({ openWarning: false })}>Ei</Button>

              </Card>
            </Dialog>


            <Dialog className="DelWarn" isOpen2={this.state.valmisWarning} onClose={(e) => this.setState({ valmisWarning: false })}>

              <Card className="Cards">

                {sessionStorage.getItem("userValmis") === "Ei" ? <CardTitle className="warningBox">Haluatko viedä tämän taulun valmiina oleviin?</CardTitle> : undefined}
                {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardTitle className="warningBox">Haluatko viedä tämän taulun pois valmiina olevista?</CardTitle> : undefined}
                {sessionStorage.getItem("userValmis") === "Ei" ? <CardTitle className="warningBox">Onko kaikki jo kerätty?</CardTitle> : undefined}
                <CardText className="warningBox">ID: {_id}</CardText>
                <CardText className="warningBox">Kauppa: {kauppa}</CardText>
                <CardText className="warningBox">Keräyspäivämäärä: {date}</CardText>
                <CardText className="warningBox">Toimitus päivämäärä: {toimituspvm}</CardText>
                <CardText className="warningBox">Kerättävien kohteiden määrä: {products.length}</CardText>
                <CardText className="warningBox">Kerätty: {counts.Kerätty === undefined ? 0 : counts.Kerätty}/{products.length}</CardText>
                <CardText className="warningBox">Ei ole: {counts.Eiole === undefined ? 0 : counts.Eiole}/{products.length}</CardText>

                <Button name="valmis_kylla" className="dialogBtn" color="success" onClick={() => this.valmisData(_id, products)}>Kyllä</Button>
                <Button name="valmis_ei" className="dialogBtn" color="danger" onClick={() => this.setState({ valmisWarning: false })}>Ei</Button>

              </Card>
            </Dialog>

            <Dialog className="Muokkaus" isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
              <Card className="UpdateCards">
                <div>
                  <CardTitle className="KeraysPVM">Keräyspäivämäärä</CardTitle>
                  <DatePicker className="DateUpdate"
                    selected={this.state.startDate}
                    onChange={this.pvmMuutos}
                    dateFormat="d/MM/yyyy"
                    onCalendarClose={() => sessionStorage.setItem('userDate2', format(this.state.startDate, "dd/MM/yyyy"))}
                  />

                  <CardTitle className="ToimitusPVMText">Toimituspäivämäärä</CardTitle>
                  <DatePicker className="ToimitusPVM"
                    selected={this.state.startDate2}
                    onChange={this.toimituspvmMuutos}
                    dateFormat="dd/MM/yyyy"
                  />

                  <Input
                    className="CustomerInfo"
                    type="textarea"
                    name="customerInfo"
                    placeholder={alisatieto}
                    onChange={this.handleChange}>
                  </Input>
                </div>

                <CardTitle>
                  <MyAutosuggest items={this.props.items2} id={`kauppa/${_id}`} placeholder={kauppa} sendClass={"AutoCompletePropsInput"} getDivClass={"AutoCompletePropsText"} />
                </CardTitle>

                <CardText>{_id}</CardText>
                <Table className="Tables">

                  <Thead>
                    <Tr>
                      <Th>Tuote</Th>
                      <Th>Kerätään</Th>
                      <Th>Keräyspiste</Th>
                      <Th>Lisätietoa</Th>
                    </Tr>
                  </Thead>

                  {products.map(product =>
                    <Tbody key={"dialog" + _id}>
                      <Tr>
                        <Td>
                          <div className="inputlabelU">
                            <MyAutosuggest items={this.props.items} id={`kukka/${product._id}`} placeholder={product.kukka} sendClass={"AutoCompleteInput"} getDivClass={"AutoCompleteText"} />
                          </div>
                        </Td>

                        <Td>
                          <Input type="number"
                            name="toimi"
                            id={`toimi/${product._id}`}
                            onChange={this.handleChange}
                            className="inputlabelU"
                            placeholder={product.toimi}>
                          </Input>
                        </Td>

                        <Td>
                          <Input type="select"
                            name="kerays"
                            id={`kerays/${product._id}`}
                            onChange={this.handleChange}
                            className="inputlabelU"
                            defaultValue={product.kerays}>
                            <option>Ryönä</option>
                            <option>Tuusjärvi</option>
                          </Input>
                        </Td>

                        <Td>
                          <Input type="text"
                            name="lisatieto"
                            id={`lisatieto/${product._id}`}
                            onChange={this.handleChange}
                            className="inputlabelA"
                            placeholder={product.lisatieto}>
                          </Input>
                          <Button className="delProduct" name="poista_kukka" color="danger" onClick={() => this.deleteData(product)}>X</Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  )}
                </Table>
                <div>
                  <Button name="lisaa_kukka" className="addFlower" onClick={() => this.addFlowers(_id, products)}>Lisää kukka</Button>
                  <Input type="number"
                    name="addFlowersValue"
                    className="addFlowerInput"
                    max={10}
                    min={1}
                    value={this.state.addFlowersValue}
                    onChange={this.handleChange}>
                  </Input>
                </div>
                <div className="taulukkoDivider"></div>
                <Button name="paivita_taulukon_tiedot" color="success" onClick={() => this.putFlowersIData(products, _id, kauppa, alisatieto, toimituspvm, date)}>Päivitä taulukon tiedot</Button>
              </Card>
            </Dialog>
          </div>
        </div >
      </ErrorBoundary>
    )
  }
}

export default PeopleCard;
