import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PeopleCard from './PeopleCard';
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

  componentDidMount() {
    if (sessionStorage.getItem('userData')) {
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

  isMobile = navigator.userAgent.match(/Mobile/i) != null;
  if(isMobile) {
    ColVal = 4;
  }
  render() {

    if (this.state.redirect) {
      return (<Redirect to={'/'} />)
    }
    let peopleCards = this.state.people.map(person => {
      return (
        <Container fluid>
          <Row>
            <PeopleCard key={person._id} removePerson={this.removePerson.bind(this)} person={person} />
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
