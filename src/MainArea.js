import React, { Component } from 'react';
import { Container, Row, Col, Card, Input, Button } from 'reactstrap';
import PeopleCard from './PeopleCard';
import "./flowers.css";
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';

let ColVal = 6;

class MainArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      people2: [],
      isLoaded: false,
      redirect: false
    }
  }

  componentWillMount() {
    if(sessionStorage.getItem('userData')) {
    } else {
      this.setState({
        redirect: true
      });
    }
  }

  componentDidMount() {
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
    fetch('http://localhost:3002/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
   
        //add data
      }),
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
    let peopleCards = this.state.people.map(person => {
      return (
        <Col sm={ColVal}>
          <PeopleCard key={person._id} updatePerson={this.updatePerson.bind(this)} removePerson={this.removePerson.bind(this)} person={person} />
          
        </Col>
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
