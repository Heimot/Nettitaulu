import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardText, CardTitle, Button, Input } from 'reactstrap';
import Dialog from './components/dialog/editDialog';
import { Table, Thead, Tbody, Tr, Td, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { deleteFlowerData, patchKeraysData, putFlowersOrderData, patchValmiusProductsData, patchValmiusData, updateFlowersEdit, patchTarkastettuProductsData } from './components/fetch/apiFetch';
import MyAutosuggest from "./components/autoComplete/autoComplete";
import { FETCH_URL } from "./components/fetch/url";
import XLSX from 'xlsx';
import socketIOClient from "socket.io-client";
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import language from './components/language/language';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './pictures/Heimosen_Puutarha_logo.png';

//CSS files
import "./Styles/Table.css";
import "./Styles/progressBar.css";

let change = false;
var arr = [];
let delPrint2 = false;

var img = new Image();
img.src = logo;

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
      rullakot: false,
    }
  }

  Progress = ({ done, count, counter, id }) => {
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

  async valmisData(_id, products, counts2) {
    try {
      let ids = [];
      let valmius;
      let valmius2;
      let location = "";
      let i = 0;
      let p = 0;
      let id;

      if (products.length === counts2.Kyllä && sessionStorage.getItem('siteName') === "Valmiit") {
        valmius = "Arkistoitu";
        valmius2 = "Arkistoitu";
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

  patchData(product, kauppa, _id) {
    try {
      this.printOut(product, kauppa);
      const idvalues = document.getElementById(`keratty/${product._id}`).value;
      var maara = document.getElementById(product._id).value;
      patchKeraysData(product, idvalues, maara);
      socket.emit('idUpdate', {
        id: _id,
        product: product._id,
        message: true
      });
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
    if (this.props.delPrint) {
      arr = [];
      delPrint2 = false;
      this.props.cleanUp(delPrint2);
    }
    if (product.keratty === "Odottaa keräystä") {
      arr.push({
        kauppa: kauppa,
        tuote: product.kukka,
        maara: product.toimi,
        lisatieto: product.lisatieto,
        id: product._id,
        kerays: product.kerays
      });

      this.setState({
        printData: arr
      })
      this.props.printDataArr(arr)
    }
  }

  patchTarkastettu(product) {
    let valmius;
    switch (product.tarkastettu) {
      case "Ei":
        valmius = "Kyllä";
        break;

      case "Kyllä":
        valmius = "Ei";
        break;

      default:
        valmius = "Ei";
        break;
    }
    patchTarkastettuProductsData(product, valmius);
    socket.emit('chat', {
      message: true
    });
  }

  htmlToPDF(tuusjarvi, ryona, _id, products, kauppa, date, alisatieto, toimituspvm) {
    var doc = new jsPDF();
    let i = 0;
    let b = 1;
    let productsLenght = products.length;
    let result = [];

    for (i = 0; i < productsLenght; i++) {
      result.push([products[i].kukka.toString(), products[i].kerattymaara.toString()])
    };

    let text = alisatieto.toString();

    var textLine = doc.splitTextToSize(text, 75);

    var header = function () {
      doc.setFontSize(15)
      doc.text(`Keräyspäivämäärä: ${date.toString()}`, 15, 32)
      doc.text(`Toimituspäivämäärä: ${toimituspvm.toString()}`, 15, 39)
      doc.text(`${kauppa.toString()}`, 15, 50)
      doc.addImage(img, "png", 15, 2, 50, 22)
      doc.setFontSize(10)
      doc.text(textLine, 150, 30)
      doc.text(`${_id.toString()}`, 15, 58)
      doc.text(`${b.toString()}`, 202, 7)
      b++;
    };

    doc.autoTable({
      head: [['Tuote', 'Kerättymäärä']],
      body: result,
      margin: { horizontal: 0, top: 60 },
      bodyStyles: { valign: 'top' },
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { text: { cellWidth: 'auto' } },
      didDrawPage: header
    });

    doc.save('order.pdf');
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
    let { tuusjarvi, ryona, _id, products, kauppa, date, alisatieto, toimituspvm, rullakot } = this.props.person;

    // Counter for displaying procentages.
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

    // Counter2 for displaying button in valmiit.
    let array2 = [];
    let result2 = {};
    let counts2 = {};
    array2.push(
      products.map(doc => {
        return doc.tarkastettu;
      })
    )
    Object.keys(result2).map(key => ({ [key]: result2[key] }))
    for (let i = 0; i < array.length; i++) {
      result2[array2[i]] = (result2[array2[i]] || 0) + 1
    }
    Object.keys(result2).map(str => str.replace(/\s/g, '')).toString().split(",").forEach(function (x) { counts2[x] = (counts2[x] || 0) + 1; });

    return (
      <ErrorBoundary>
        <div className="myDiv">
          <div className="NavBlock"></div>
          <div>
            <Card className="Cards" id={`pdfPrint${_id}`}>
              <CardTitle>{language[localStorage.getItem('language')].ready5} {date}</CardTitle>
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardTitle>{language[localStorage.getItem('language')].ready6} {toimituspvm}</CardTitle> : sessionStorage.getItem("userValmis") === "Arkistoitu" ? <CardTitle>{language[localStorage.getItem('language')].ready6} {toimituspvm}</CardTitle> : undefined}
              <CardTitle>{kauppa}</CardTitle>
              <CardText>{_id}</CardText>
              <CardText className="lisatieto">{alisatieto}</CardText>
              <CardText></CardText>
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardText>{language[localStorage.getItem('language')].tarkastettuR}{ryona === "Kyllä" ? language[localStorage.getItem('language')].tarkastettuAnswerYes : language[localStorage.getItem('language')].tarkastettuAnswerNo}</CardText> : undefined}
              {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardText>{language[localStorage.getItem('language')].tarkastettuT}{tuusjarvi === "Kyllä" ? language[localStorage.getItem('language')].tarkastettuAnswerYes : language[localStorage.getItem('language')].tarkastettuAnswerNo}</CardText> : undefined}

              <Button className="rullakot" onClick={() => this.setState({ rullakot: true })}>Rullakot</Button>

              <Dialog className="DelWarn" isOpen2={this.state.rullakot} onClose={(e) => this.setState({ rullakot: false })}>
                {rullakot.map(rullakko =>
                <div className="bottomRulla">
                  <Card className="rullakkoKortti">
                    Rullakko: {rullakko.rullakonNimi}<br/>Rullakoiden määrä: {rullakko.rullakoidenMaara}<br/>Hyllyjen määrä: {rullakko.hyllyjenMaara}
                  </Card>
                  </div>
                )}
              </Dialog>

              <div className="loaders" >
                <div className="loaderMargins">
                  <CardText className="hover">{language[localStorage.getItem('language')].statusBar1}</CardText>
                  <this.Progress done={100 * Math.abs(counts.Odottaakeräystä / Object.keys(result).toString().split(",").length)} count={counts.Odottaakeräystä} counter={products.length} id={"Odottaa keräystä"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">{language[localStorage.getItem('language')].statusBar2}</CardText>
                  <this.Progress done={100 * Math.abs(counts.Keräyksessä / Object.keys(result).toString().split(",").length)} count={counts.Keräyksessä} counter={products.length} id={"Keräyksessä"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">{language[localStorage.getItem('language')].statusBar3}</CardText>
                  <this.Progress done={100 * Math.abs(counts.Kerätty / Object.keys(result).toString().split(",").length)} count={counts.Kerätty} counter={products.length} id={"Kerätty"} />
                </div>

                <div className="loaderMargins">
                  <CardText className="hover">{language[localStorage.getItem('language')].statusBar4}</CardText>
                  <this.Progress done={100 * Math.abs(counts.Eiole / Object.keys(result).toString().split(",").length)} count={counts.Eiole} counter={products.length} id={"Ei ole"} />
                </div>
              </div>

              <Table className="Tables" id={`id/${_id}`}>

                <Thead>
                  <Tr>
                    <Th>{language[localStorage.getItem('language')].tuote}</Th>
                    <Th>{language[localStorage.getItem('language')].kerataan}</Th>
                    <Th>{language[localStorage.getItem('language')].kerayspiste}</Th>
                    <Th>{language[localStorage.getItem('language')].lisatietoa}</Th>
                    <Th>{language[localStorage.getItem('language')].keraamassa}</Th>
                    <Th>{language[localStorage.getItem('language')].kerattymaara}</Th>
                  </Tr>
                </Thead>

                {products.map(product => {
                  return (
                    <Tbody key={product._id}>
                      <Tr className={product.tarkastettu === "Ei" ? undefined : "ValmisRow"} onDoubleClick={sessionStorage.getItem('btnName') === "Valmiit" ? () => this.patchTarkastettu(product) : undefined}>
                        <Td className="KukkaTable">{product.kukka}</Td>
                        <Td>{product.toimi}</Td>
                        <Td>{product.kerays}</Td>
                        <Td className="lisatietoTable">{product.lisatieto}</Td>
                        <Td>
                          <Input className="keraamassaBtn"
                            type="button"
                            id={`keratty/${product._id}`}
                            value={localStorage.getItem('language') === "1" ? product.keratty === "Odottaa keräystä" ? language[1].statusBar1 : product.keratty === "Keräyksessä" ? language[1].statusBar2 : product.keratty === "Kerätty" ? language[1].statusBar3 : product.keratty === "Ei ole" ? language[1].statusBar4 : product.keratty : product.keratty}
                            placeholder={product.keratty}
                            onClick={() => this.patchData(product, kauppa, _id)}>
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
                  )
                })}
              </Table>
              {sessionStorage.getItem('userRole') === "Admin" ?
                <Button
                  name="valmisBtn"
                  className="valmisBtn"
                  disabled={sessionStorage.getItem('userRole') === "Admin" ? sessionStorage.getItem('siteName') === "Valmiit" ? products.length === counts2.Kyllä ? false : true : false : true}
                  color="success"
                  onClick={() => this.valmis()}>
                  {sessionStorage.getItem("siteName") === "Valmiit" ? language[localStorage.getItem('language')].arkistoi : language[localStorage.getItem('language')].valmis}
                </Button>
                : undefined}

              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="muokkaaBtn" className="muokkaaBtn" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="primary" onClick={() => this.muokkaa(_id, products, kauppa, date, alisatieto, toimituspvm)}>{language[localStorage.getItem('language')].muokkaa}</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="poistaBtn" className="poistaBtn" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="danger" onClick={() => this.warning()}>{language[localStorage.getItem('language')].poista}</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? <Button name="vieExcel" className="vieExcel" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="info" onClick={() => this.jsonToExcel(products, _id)}>{language[localStorage.getItem('language')].vieExceliin}</Button> : undefined}
              {sessionStorage.getItem('userRole') === "Admin" ? sessionStorage.getItem('siteName') === "Valmiit" ? <Button name="vieExcel" className="vieExcel" disabled={sessionStorage.getItem('userRole') === "Admin" ? false : true} color="warning" onClick={() => this.htmlToPDF(tuusjarvi, ryona, _id, products, kauppa, date, alisatieto, toimituspvm)}>{language[localStorage.getItem('language')].talPDF}</Button> : undefined : undefined}
            </Card>

            <Dialog className="DelWarn" isOpen2={this.state.openWarning} onClose={(e) => this.setState({ openWarning: false })}>

              <Card className="Cards">

                <CardTitle className="warningBox">{language[localStorage.getItem('language')].delete1}</CardTitle>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready3 + _id}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready4 + kauppa}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready5 + date}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready6 + toimituspvm}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].delete2 + products.length}</CardText>

                <Button name="delete_kylla" className="dialogBtn" color="success" onClick={() => this.props.removePerson(_id, products) + this.setState({ openWarning: false })}>{language[localStorage.getItem('language')].yes}</Button>
                <Button name="delete_ei" className="dialogBtn" color="danger" onClick={() => this.setState({ openWarning: false })}>{language[localStorage.getItem('language')].no}</Button>

              </Card>
            </Dialog>


            <Dialog className="DelWarn" isOpen2={this.state.valmisWarning} onClose={(e) => this.setState({ valmisWarning: false })}>

              <Card className="Cards">

                {sessionStorage.getItem("userValmis") === "Ei" ? <CardTitle className="warningBox">{language[localStorage.getItem('language')].ready1}</CardTitle> : undefined}
                {sessionStorage.getItem("userValmis") === "Kerätty" ? <CardTitle className="warningBox">{language[localStorage.getItem('language')].ready11}</CardTitle> : undefined}
                {sessionStorage.getItem("userValmis") === "Ei" ? <CardTitle className="warningBox">{language[localStorage.getItem('language')].ready2}</CardTitle> : undefined}
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready3 + _id}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready4 + kauppa}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready5 + date}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready6 + toimituspvm}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready7 + products.length}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready8} {counts.Kerätty === undefined ? 0 : counts.Kerätty}/{products.length}</CardText>
                <CardText className="warningBox">{language[localStorage.getItem('language')].ready9} {counts.Eiole === undefined ? 0 : counts.Eiole}/{products.length}</CardText>

                <Button name="valmis_kylla" className="dialogBtn" color="success" onClick={() => this.valmisData(_id, products, counts2)}>{language[localStorage.getItem('language')].yes}</Button>
                <Button name="valmis_ei" className="dialogBtn" color="danger" onClick={() => this.setState({ valmisWarning: false })}>{language[localStorage.getItem('language')].no}</Button>

              </Card>
            </Dialog>

            <Dialog className="Muokkaus" isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
              <Card className="UpdateCards">
                <div>
                  <CardTitle className="KeraysPVM">{language[localStorage.getItem('language')].kerayspvm}</CardTitle>
                  <DatePicker className="DateUpdate"
                    selected={this.state.startDate}
                    onChange={this.pvmMuutos}
                    dateFormat="d/MM/yyyy"
                    onCalendarClose={() => sessionStorage.setItem('userDate2', format(this.state.startDate, "dd/MM/yyyy"))}
                  />

                  <CardTitle className="ToimitusPVMText">{language[localStorage.getItem('language')].toimituspvm}</CardTitle>
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
                      <Th>{language[localStorage.getItem('language')].tuote}</Th>
                      <Th>{language[localStorage.getItem('language')].kerataan}</Th>
                      <Th>{language[localStorage.getItem('language')].kerayspiste}</Th>
                      <Th>{language[localStorage.getItem('language')].lisatietoa}</Th>
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
                  <Button name="lisaa_kukka" className="addFlower" onClick={() => this.addFlowers(_id, products)}>{language[localStorage.getItem('language')].addflower}</Button>
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
                <Button name="paivita_taulukon_tiedot" color="success" onClick={() => this.putFlowersIData(products, _id, kauppa, alisatieto, toimituspvm, date)}>{language[localStorage.getItem('language')].paivita}</Button>
              </Card>
            </Dialog>
          </div>
        </div >
      </ErrorBoundary>
    )
  }
}

export default PeopleCard;
