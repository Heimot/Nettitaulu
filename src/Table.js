import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TableCard from './TableCard';

class TableArea extends Component {
  constructor() {
    super();
    this.state = {
      people: []
    }
  }
  componentDidMount() {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          people: json,
        })
      });
  }
  render() {
    let peopleCards = this.state.people.map(person => {
      return (
        <Col sm="4">
        </Col>
      )
    })
    return (
      <Container fluid>
        <Row>
          {peopleCards}
        </Row>
      </Container>
    )
  }
}

export default TableArea;
