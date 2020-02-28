import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import CheckedCard from './CheckedCard';
import { Redirect } from 'react-router-dom';
import { css } from "@emotion/core";
import Loader from "react-spinners/ScaleLoader";
import { getData, removeData } from './components/fetch/apiFetch';
import './Styles/MainAreas.css';

const valmis = 1;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class MainCheckArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      people2: [],
      isLoaded: false,
      redirect: false,
      loading: true
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
    this.setState({
      people: data,
      isLoaded: true,
      loading: false
    })
    console.log(data);
  }

  removePerson(_id) {
    removeData(_id)
    this.setState({ people: this.state.people.filter(person => person._id !== _id) });
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

    if((this.state.people).length <= 0 && this.state.isLoaded === true) {
    return <h1 className="TEST">Ei valmiita päivältä {sessionStorage.getItem("userDate")}</h1>
    }

    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    let peopleCards = this.state.people.map(person => {
      return (
        <Container fluid>
          <Row>
            <CheckedCard key={person._id} removePerson={this.removePerson.bind(this)} person={person} />
          </Row>
        </Container>


      )
    })
    return (
      <Container fluid>
        <Row>
          {CheckedCard !== null ? peopleCards : undefined}
        </Row>
      </Container>
    )
  }
}

export default MainCheckArea;
