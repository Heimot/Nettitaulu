import React, { Component } from 'react';
import { Container, Row, Button } from 'reactstrap';
import PeopleCard from './PeopleCard';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import Dialogs from './components/dialog/loaderDialog';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { getData, removeData, deleteFlowersData, getFlowersToAutocomplete } from './components/fetch/apiFetch';
import socketIOClient from "socket.io-client";
import { FETCH_URL } from './components/fetch/url';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import Printer from './components/printWindow/printData';

//CSS
import './Styles/MainAreas.css';

let DataF = ["error", "abcderror"];
let DataK = ["error", "abcderror"];
let searchData = "";
let chosen = "";
let data = [];
let Datas = [];

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const endpoint = FETCH_URL;
const socket = socketIOClient(endpoint);

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
    }
    this.getTables = this.getTables.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.printDataNav = this.printDataNav.bind(this);
    this.printDataArray = this.printDataArray.bind(this);
    this.emptyData = this.emptyData.bind(this);
  }

  componentDidMount() {
    try {
      if(localStorage.getItem('language') === null) {
        localStorage.setItem('language', 0) 
      }
      if (sessionStorage.getItem("userData") === null) {
        this.setState(() => ({
          redirect: true
        }));
      } else {
        this.getTables();
        socket.on('chat', async (data) => {
          if (data.message === true) {
            this.getTables();
          };
        });
      }
    } catch (error) {
      console.log(error);
    };
  }


  getTables = async () => {
    try {
      data = await getData(searchData, chosen);
      Datas = await getFlowersToAutocomplete();
      DataK = Datas[1].kaupat
      DataF = Datas[0].flowers;

      this.setState({
        people: data.product,
        isLoaded: true,
        loading: false
      })
    } catch (error) {
      console.log(error);
    };
  }

  async removePerson(_id, products) {
    try {
      this.setState({
        dLoader: true,
      })
      let ids = await products.map(product => {
        return product._id
      });
      let i = 0;
      while (i < ids.length) {
        let id = ids.shift();
        await deleteFlowersData(id);
      }
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
      if (printTF) {
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

  render() {
    if (this.state.print === true) {
      return (
        <div>
          <Printer newData={this.state.printArr} print={this.state.print} printData={this.printDataNav} emptyData={this.emptyData} />
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
      if ((person.products.length > 0 && person.tuusjarvi === "Ei") || (person.products.length > 0 && person.ryona === "Ei") || (localStorage.getItem("userLocation") === "Molemmat" && sessionStorage.getItem("userValmis") !== "Kerätty" && person.tuusjarvi !== "Kyllä" && person.ryona !== "Kyllä") || (sessionStorage.getItem("userValmis") === "Kerätty" && person.ryona === "Kyllä" && sessionStorage.getItem("userValmis") === "Kerätty" && person.tuusjarvi === "Kyllä")) {
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
                <Button className="printBtn1" onClick={() => this.printDataNav()}>{this.state.printArr.length > 0 ? <h1 className="printLength">{this.state.printArr.length}</h1> :  undefined}</Button>
                <PeopleCard getTables={this.getTables} removePerson={this.removePerson} person={person} items={DataF} items2={DataK} search={searchData} chosenData={chosen} handleSearch={this.handleSearch} printDataArr={this.printDataArray} />

                <Nav getTables={this.getTables} handleSearch={this.handleSearch} printData={this.printDataNav} items={DataF} items2={DataK} />
              </Row>
            </Container>
          </ErrorBoundary>
        )
      } else {
        return (<ErrorBoundary><Nav getTables={this.getTables} handleSearch={this.handleSearch} printData={this.printDataNav} items={DataF} items2={DataK} /></ErrorBoundary>)
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
