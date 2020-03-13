import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import PeopleCard from './PeopleCard';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import Dialogs from './components/fetch/dialog/loaderDialog';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { getData, removeData, deleteFlowersData } from './components/fetch/apiFetch';
import './Styles/MainAreas.css';

const valmis = 0;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class MainArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      people2: [],
      isLoaded: false,
      redirect: false,
      loading: true,
      dLoader: false,
    }
  }

  componentDidMount() {
    this.getTables();
    if (sessionStorage.getItem('userData')) {
    } else {
      this.setState({
        redirect: true
      });
    }
  }

  getTables = async () => {
    const data = await getData(valmis);
    console.log(data);
    this.setState({
      people: data,
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
    this.setState({ people: this.state.people.filter(person => person._id !== _id), dLoader: false });
  }

  render() {

    if (this.state.isLoaded === false) {
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
      return <h1 className="TEST">Ei kerättävää päivällä {sessionStorage.getItem("userDate")}</h1>
    }

    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    let peopleCards = this.state.people.map(person => {
      return (
        <Container fluid>
          <Row>
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
            <PeopleCard key={person._id} getTables={this.getTables.bind(this)} removePerson={this.removePerson.bind(this)} person={person} />
            <Nav style={{ visibility: "hidden;" }} getTables={this.getTables.bind(this)} />
          </Row>
        </Container>


      )
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
