import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import CheckedCard from './CheckedCard';
import './Styles/flowers.css';
import { Redirect } from 'react-router-dom';

let ColVal = 6;

class MainCheckArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      people2: [],
      isLoaded: false,
      redirect: false
    }
  }

  componentDidMount() {
    if(sessionStorage.getItem('userData')) {
    } else {
      this.setState({
        redirect: true
      });
    }
    var GETwAuth = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      }
    }

    fetch('http://localhost:3002/products', GETwAuth)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          isLoaded: true,
          people: json,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  removePerson(_id) {
    fetch('http://localhost:3002/products/' + _id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('userData')
      },
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch((error) => {
        console.log(error);
      });
    this.setState({ people: this.state.people.filter(person => person._id !== _id) });
  }

  updatePerson(_id) {
    alert(_id + "UPDATED");
  }

  isMobile = navigator.userAgent.match(/Mobile/i) != null;
  if(isMobile) {
    ColVal = 4;
  }
  render() {

    if(this.state.redirect) {
      return (<Redirect to={'/'}/>)
    }
    let checkedCards = this.state.people.map(person => {
      return (
        <Col sm={ColVal}>
          <CheckedCard key={person._id} updatePerson={this.updatePerson.bind(this)} removePerson={this.removePerson.bind(this)} person={person} />
          
        </Col>
      )
    })
    return (
      <Container fluid>
        <Row>
          {CheckedCard !== null ? checkedCards : undefined}
        </Row>
      </Container>
    )
  }
}

export default MainCheckArea;
