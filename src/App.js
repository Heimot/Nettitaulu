import React, { Component } from 'react';
import './App.css';
import TopNav from './Nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainArea from './MainArea';
import LogIn from './LogIn';
import LoginNav from './LoginNav';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={LoginNav} />
          <Route path="/" exact component={LogIn} />
          <Route path="/main" component={TopNav} />
          <Route path="/main" component={MainArea} />
        </div>
      </Router>
    );
  }
}

export default App;
