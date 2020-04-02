import React, { Component } from 'react';
import { Container, Row, Card, Input, Button, CardText } from 'reactstrap';
import Dialog from './components/dialog/editDialog';
import { Redirect } from 'react-router-dom';
import { FETCH_URL } from './components/fetch/url';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import language from './components/language/language';

//CSS
import './Styles/login.css';

if(localStorage.getItem('language') === null) {
  localStorage.setItem('language', 0);
}

class TableArea extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      isOpen2: true,
      email: "",
      password: "",
      redirect: false,
      loginFailed: false,
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
        if(json.message === "Auth failed") {
          this.setState({
            loginFailed: true
          })
        }
        let result = json;
        if (result.token) {
          sessionStorage.setItem('userData', result.token);
          this.parseJwt();
          this.setState({
            redirect: true,
            loginFailed: false
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loginFailed: true
        })
      });
  }

  parseJwt() {
    try {
      var base64Url = sessionStorage.getItem('userData').split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      sessionStorage.setItem('userRole', JSON.parse(jsonPayload).roles);
    } catch (error) {
      console.log(error);
    };
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    let { redirect, loginFailed } = this.state;

    if (redirect) {
      return (<Redirect to={'/main'} />)
    }

    if (sessionStorage.getItem('userData')) {
      return (<Redirect to={'/main'} />)
    }

    return (
      <ErrorBoundary>
        <Container fluid>
          <Row>
            <Dialog isOpen2={this.state.isOpen2} onClose={(e) => this.setState({ isOpen2: false })}>
            {loginFailed === true ? <CardText className="loginFailed">{language[localStorage.getItem('language')].loginWarning}</CardText> : undefined}
              <Card>
                <Input
                  type="text"
                  name="username"
                  onChange={this.handleChange}
                  className="lposition"
                  placeholder={language[localStorage.getItem('language')].username}>
                </Input>

                <Input
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  className="lposition"
                  placeholder={language[localStorage.getItem('language')].password}>
                </Input>

                <Button name="kirjaudu" type="submit" onClick={(e) => this.login()}>{language[localStorage.getItem('language')].login}</Button>

              </Card>
            </Dialog>
          </Row>
        </Container>
      </ErrorBoundary>
    )

  }
}

export default TableArea;
