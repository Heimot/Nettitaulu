import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PeopleCard from './PeopleCard';
import "./flowers.css";
import Swal from 'sweetalert2'
let ColVal;

class MainArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
    }
  }
  componentDidMount() {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(json =>  {
        this.setState({
          isLoaded: true,
          people: json,
        })
      });
  }
  removePerson(_id) {
  fetch('http://localhost:3001/tasks', {
    method: 'POST',
   /* headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },*/
    body: JSON.stringify({
      kukat: {
          orvokki: {
              orvokkinimi: "OgRv",
              orvtilattu: 1002,
              orvtoimitetaan: 1002,
              orvlisatieto: "kg",
              orvjaljella: 1020,
              orvkerays: "Ryögnä"
          },
          pelargonia: {
              orvokkinimi: "PgEl",
              orvtilattu: 120,
              orvtoimitetaan: 120,
              orvlisatieto: "kf",
              orvjaljella: 10,
              orvkerays: "Tuusjgärvi"
          }
      },
      name: "Prisma Kguopio"
    }),
  })
  .then(response => response.json())
  .then(json => console.log(json))
  console.log("???");
    this.setState({ people: this.state.people.filter(person => person._id !== _id)});
    /*return fetch('http://localhost:3001/tasks/' + _id, {
      method: 'DELETE',
  }).then(response => response.json())
  .then(response => console.log(response))
    postData('http://localhost:3001/tasks', {"kukat": { "orvokki": { "orvokkinimi": "ORv", "orvtilattu": 100, "orvtoimitetaan": 100, "orvlisatieto": "k", "orvjaljella": 100, "orvkerays": "Ryönä" }, "pelargonia": { "orvokkinimi": "PEl", "orvtilattu": 10, "orvtoimitetaan": 10, "orvlisatieto": "k", "orvjaljella": 10, "orvkerays": "Tuusjärvi"} }, "name": "Prisma Iisalmi" })
  .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
  .catch(error => console.error(error));
return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json());*/
}
 
  isMobile = navigator.userAgent.match(/Mobile/i) != null;
  if (isMobile) {
      ColVal = 4;
  }

  render () {
    let peopleCards = this.state.people.map(person => {
      return (
        <Col sm={ColVal}>
          <PeopleCard key={person._id} removePerson={this.removePerson.bind(this)} person={person}/>
          
        </Col>
      )
    })
    return (
      <Container fluid>
        <Row>
          {PeopleCard !== null ?peopleCards: undefined}
        </Row>
      </Container>
    )
  }
}

export default MainArea;
