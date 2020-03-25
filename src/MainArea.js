import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import PeopleCard from './PeopleCard';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import Dialogs from './components/dialog/loaderDialog';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { getData, removeData, deleteFlowersData, getFlowersToAutocomplete } from './components/fetch/apiFetch';

//CSS
import './Styles/MainAreas.css';

let DataF = ["error", "abcderror"];
let DataK = ["error", "abcderror"];
let searchData = "";
let chosen = "";

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
      searchLength: 0
    }
    this.getTables = this.getTables.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    if (sessionStorage.getItem("userData") === null) {
      this.setState(() => ({
        redirect: true
      }));
    }
    this._isMounted = true;
    this.getTables();
  }



  getTables = async () => {
    const data = await getData(searchData, chosen);
    const Datas = await getFlowersToAutocomplete();
    DataK = Datas[1].kaupat
    DataF = Datas[0].flowers;

    this.setState({
      people: data.product,
      people2: data.product,
      isLoaded: true,
      loading: false
    })
  }

  async removePerson(_id, products) {
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
    this.getTables();
  }

  handleSearch = (search, searchChosen) => {
    if (searchData !== search) {
      this.setState(() => ({
        searched: search
      }))
    }
    chosen = searchChosen;
    searchData = search;
  }

  render() {
    if(this.state.redirect) {
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
      if (person.products.length > 0 || localStorage.getItem("userLocation") === "Molemmat") {
        return (
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
              <PeopleCard getTables={this.getTables} removePerson={this.removePerson} person={person} items={DataF} items2={DataK} search={searchData} chosenData={chosen}
                handleSearch={this.handleSearch} />

              <Nav getTables={this.getTables} handleSearch={this.handleSearch} items={DataF} items2={DataK} />
            </Row>
          </Container>
        )
      } else {
        return (<Nav getTables={this.getTables} handleSearch={this.handleSearch} items={DataF} items2={DataK} />)
      }
    })
    return (
      <Container fluid>
        <Row>
          {PeopleCard !== null ? peopleCards : undefined}
        </Row>
      </Container>
    )
  }
}

export default MainArea;
