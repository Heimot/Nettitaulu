import React, { Component } from 'react';
import { Container, Row, Card, Input, Button } from 'reactstrap';
import Dialog from './components/dialog/editDialog';
import { Redirect } from 'react-router-dom';
import { FETCH_URL } from './components/url';

class TableArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      isOpen2: true,
      email: "",
      password: "",
      redirect: false
    }
  }

  login() {
      fetch(FETCH_URL + 'user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.username,
          password: this.state.password
        }),
      })
        .then(response => response.json())
        .then(json => {
          let result = json;
          if(result.token) {
          sessionStorage.setItem('userData', result.token);
          this.setState({
            redirect: true
          });
        }
        })
        .catch((error) => {
          console.log(error);
        });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  render() {


    if(this.state.redirect) {
      return (<Redirect to={'/main'}/>)
    }

    if(sessionStorage.getItem('userData')) {
      return (<Redirect to={'/main'}/>)
    }

    return (
      <Container fluid>
        <Row>
          <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
            <Card>
              <Input
                type="text"
                name="username"
                onChange={this.handleChange}
                className="lposition"
                placeholder="Username">
              </Input>

              <Input
                type="password"
                name="password"
                onChange={this.handleChange}
                className="lposition"
                placeholder="Password">
              </Input>

              <Button type="submit" onClick={(e) => this.login()} >Login</Button>

            </Card>
          </Dialog>
        </Row>
      </Container>
    )

  }
}

export default TableArea;
