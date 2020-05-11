import React, { Component } from 'react';
import { Container, Row, Button, CardText, Card } from 'reactstrap';
import PeopleCard from './PeopleCard';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import Dialogs from './components/dialog/loaderDialog';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { getData, removeData, deleteFlowersData, getFlowersToAutocomplete, getTableId, deleteRullakkoFromOrders, deleteHyllyFromOrders } from './components/fetch/apiFetch';
import socket from './components/socketio/socket-ioConn';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import Printer from './components/printWindow/printData';
import language from './components/language/language';

//CSS
import './Styles/MainAreas.css';
import "./Styles/progressBar.css";

let progressValue;
let DataF = ["error", "abcderror"];
let DataK = ["error", "abcderror"];
let searchData = "";
let chosen = "";
let data = [];
let Datas = [];
let delPrint = false;
let change = false;

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

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class MainArea extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      people2: [],
      isLoaded: false,
      redirect: false,
      loading: true,
      dLoader: false,
      updateOnce: false,
      searched: "",
      searchLength: 0,
      error: null,
      errorInfo: null,
      print: false,
      printArr: [],
      progressData: true,
    }
    this.getTables = this.getTables.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.printDataNav = this.printDataNav.bind(this);
    this.printDataArray = this.printDataArray.bind(this);
    this.emptyData = this.emptyData.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.showProgress = this.showProgress.bind(this);
  }

  componentDidMount() {
    try {
      if (localStorage.getItem('language') === null) {
        localStorage.setItem('language', 0)
      }
      if (sessionStorage.getItem("userData") === null) {
        this.setState(() => ({
          redirect: true
        }));
      } else {
        let dataas = true;
        this.getTables(dataas);
        socket.on('chat', async (data) => {
          dataas = data.message;
          if (data.message === true) {
            this.getTables(dataas);
          };
        });
        socket.on('idUpdate', async (data) => {
          if (data.message === true) {
            this.getTable(data);
          };
        });
      }
    } catch (error) {
      console.log(error);
    };
  }

  getTable = async (data) => {
    try {
      let { people } = this.state;
      let dataTable = [await getTableId(data, searchData)];
      var updtData = people.map(obj => dataTable.find(o => o._id === obj._id) || obj);
      this.setState({
        people: updtData
      })
    } catch (err) {
      console.log(err);
    }
  }


  getTables = async (dataas) => {
    try {
      data = await getData(searchData, chosen, dataas);
      Datas = await getFlowersToAutocomplete();
      console.log(data)
      if (Datas === undefined || Datas.message) {
        DataK = ["Error", "Error2", "DatabaseNoData"];
        DataF = ["Error", "Error2", "DatabaseNoData"];
      } else {
        DataK = Datas.item.kaupat
        DataF = Datas.item.flowers;
      }

      this.setState({
        people: data.product,
        isLoaded: true,
        loading: false
      })
    } catch (error) {
      console.log(error);
    };
  }

  async removePerson(_id, products, rullakot, hyllyt) {
    try {
      this.setState({
        dLoader: true,
      })
      await products.map(product => {
        let id = product._id
        deleteFlowersData(id);
      });
      await rullakot.map(rullakko => {
        deleteRullakkoFromOrders(rullakko);
      });
      await hyllyt.map(hylly => {
        deleteHyllyFromOrders(hylly);
      });
      await removeData(_id);
      this.setState({ dLoader: false })
      socket.emit('chat', {
        message: true
      });
    } catch (error) {
      console.log(error);
    };
  }

  handleSearch = (search, searchChosen) => {
    try {
      if (searchData !== search) {
        this.setState(() => ({
          searched: search
        }))
      }
      chosen = searchChosen;
      searchData = search;
    } catch (error) {
      console.log(error);
    };
  }

  printDataNav(printTF) {
    try {
      if (printTF === true) {
        printTF = false;
        this.setState({
          print: printTF,
        })
      } else {
        printTF = true;
        this.setState({
          print: printTF,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  printDataArray(arr) {
    try {
      this.setState({
        printArr: arr
      })
    } catch (err) {
      console.log(err);
    }
  }

  emptyData() {
    this.setState({
      printArr: []
    });
  }

  cleanUp(delPrint2) {
    if (delPrint2) {
      delPrint = true;
    } else {
      delPrint = false;
    }
  }

  showProgress(progressValue) {
    if (progressValue === false) {
      this.setState({
        progressData: true
      })
    } else {
      this.setState({
        progressData: false
      })
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

  closeWindow() {
    progressValue = false;
    this.showProgress(progressValue);
  }

  render() {
    let Odottaakeraysta = [];
    let Kerayksessa = [];
    let Keratty = [];
    let Eiole = [];
    let allMaara = 0;
    let OdottaaMaara = 0;
    let KerayksessaMaara = 0;
    let KerattyMaara = 0;
    let EioleMaara = 0;
    let allCounts2 = [];
    let array2 = [];
    let counter = {}
    let arratest = [];

    this.state.people.map(person => {
      array2.push(
        person.products.map(doc => {
          return doc.keratty;
        })
      )
    })

    for (let y = 0; y < array2.length; y++) {
      arratest = arratest.concat(array2[y])
    }

    arratest.map(str => str.replace(/\s/g, '')).forEach(function (obj) {
      counter[obj] = (counter[obj] || 0) + 1
    })

    Odottaakeraysta.push(counter.Odottaakeräystä);
    Kerayksessa.push(counter.Keräyksessä);
    Keratty.push(counter.Kerätty);
    Eiole.push(counter.Eiole);
    allCounts2.push(Object.keys(arratest).toString().split(",").length);

    Odottaakeraysta = Odottaakeraysta.filter(Boolean);
    Kerayksessa = Kerayksessa.filter(Boolean);
    Keratty = Keratty.filter(Boolean);
    Eiole = Eiole.filter(Boolean);
    allCounts2 = allCounts2.filter(Boolean);

    allMaara = allCounts2.reduce((a, b) => a + b, 0);
    OdottaaMaara = 100 * Math.abs(Odottaakeraysta.reduce((a, b) => a + b, 0) / allMaara);
    KerayksessaMaara = 100 * Math.abs(Kerayksessa.reduce((a, b) => a + b, 0) / allMaara);
    KerattyMaara = 100 * Math.abs(Keratty.reduce((a, b) => a + b, 0) / allMaara);
    EioleMaara = 100 * Math.abs(Eiole.reduce((a, b) => a + b, 0) / allMaara);


    if (this.state.print === true) {
      return (
        <div>
          <Printer newData={this.state.printArr} print={this.state.print} printData={this.printDataNav} emptyData={this.emptyData} delPrint={delPrint} cleanUp={this.cleanUp} />
          <Nav getTables={this.getTables} handleSearch={this.handleSearch} printData={this.printDataNav} items={DataF} items2={DataK} showProgress={this.showProgress} />
        </div>
      )
    }

    if (this.state.redirect) {
      return <Redirect to="/" />
    }

    if (!this.state.isLoaded) {
      return <div className="Spinner">
        <Loader
          css={override}
          height={140}
          width={16}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    }

    if (this.state.people.length <= 0 && this.state.isLoaded === true) {
      if (this.state.updateOnce) {
        this.getTables();

      }
      return (
        <div>
          <h1 className="TEST">Ei kerättävää päivällä {sessionStorage.getItem("userDate")}</h1>
        </div>
      )
    }

    if (!this.state.updateOnce) {
      this.setState(() => ({ updateOnce: true }))
    }



    let peopleCards = this.state.people.map(person => {
      /*
      old filtering code before v1 when my api endpoint didnt filter data automatically! ;)
      (person.products.length > 0 && person.tuusjarvi === "Ei") || 

      (person.products.length > 0 && person.ryona === "Ei") || 

      (localStorage.getItem("userLocation") === "Molemmat" && sessionStorage.getItem("userValmis") !== "Kerätty" && person.tuusjarvi !== "Kyllä" && person.ryona !== "Kyllä") || 

      (sessionStorage.getItem("userValmis") === "Kerätty" && person.ryona === "Kyllä" && sessionStorage.getItem("userValmis") === "Kerätty" && person.tuusjarvi === "Kyllä")
*/

      if (person.products.length > 0) {
        return (
          <ErrorBoundary>
            <Container fluid key={person._id}>
              <Row>
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
                {this.state.progressData === false ? <div className="loaders2">
                  <Card className="cardAlignment">
                    <Button className="exitLoaders" onClick={() => this.closeWindow()}>x</Button>
                    {this.state.progressData === false ? <CardText className="progressText">{language[localStorage.getItem('language')].kokonaisMaara}</CardText> : undefined}
                    <div className="loaderMargins2">
                      <CardText className="hover">{language[localStorage.getItem('language')].statusBar1}</CardText>
                      <this.Progress done={OdottaaMaara} count={Odottaakeraysta.reduce((a, b) => a + b, 0)} counter={allMaara} id={"Odottaa keräystä"} />
                    </div>
                    <div className="loaderMargins2">
                      <CardText className="hover">{language[localStorage.getItem('language')].statusBar2}</CardText>
                      <this.Progress done={KerayksessaMaara} count={Kerayksessa.reduce((a, b) => a + b, 0)} counter={allMaara} id={"Keräyksessä"} />
                    </div>
                    <div className="loaderMargins2">
                      <CardText className="hover">{language[localStorage.getItem('language')].statusBar3}</CardText>
                      <this.Progress done={KerattyMaara} count={Keratty.reduce((a, b) => a + b, 0)} counter={allMaara} id={"Kerätty"} />
                    </div>
                    <div className="loaderMargins2">
                      <CardText className="hover">{language[localStorage.getItem('language')].statusBar4}</CardText>
                      <this.Progress done={EioleMaara} count={Eiole.reduce((a, b) => a + b, 0)} counter={allMaara} id={"Ei ole"} />
                    </div>
                  </Card>
                </div> : undefined}
                <Button className="printBtn1" onClick={() => this.printDataNav()}>{this.state.printArr.length > 0 ? <h1 className="printLength">{this.state.printArr.length}</h1> : undefined}</Button>
                <PeopleCard getTables={this.getTables} removePerson={this.removePerson} person={person} items={DataF} items2={DataK} search={searchData} chosenData={chosen} handleSearch={this.handleSearch}
                  printDataArr={this.printDataArray} delPrint={delPrint} cleanUp={this.cleanUp} />

                <Nav getTables={this.getTables} handleSearch={this.handleSearch} printData={this.printDataNav} items={DataF} items2={DataK} showProgress={this.showProgress} progressValue={progressValue} />
              </Row>
            </Container>
          </ErrorBoundary>
        )
      } else {
        return (<ErrorBoundary><Nav getTables={this.getTables} handleSearch={this.handleSearch} printData={this.printDataNav} items={DataF} items2={DataK} showProgress={this.showProgress} /></ErrorBoundary>)
      }
    })
    return (
      <ErrorBoundary>
        <Container fluid>
          <Row>
            {PeopleCard !== null ? peopleCards : undefined}
          </Row>
        </Container>
      </ErrorBoundary>
    )
  }
}

export default MainArea;
