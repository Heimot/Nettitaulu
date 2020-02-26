import React, { Component } from 'react';
import './Styles/App.css';
import TopNav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainArea from './MainArea';
import LogIn from './LogIn';
import LoginNav from './LoginNav';
import './Styles/App.css';
import MainCheckArea from './MainCheckArea';
import CheckerNav from './CheckerNav';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={LoginNav} />
          <Route path="/" exact component={LogIn} />
          <Route path="/main" component={TopNav} />
          <Route path="/main" component={MainArea} />
          <Route path="/checked" exact component={CheckerNav} />
          <Route path="/checked" component={MainCheckArea} />
        </div>
      </Router>
    );
  }
}

export default App;
