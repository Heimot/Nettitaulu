import React, { Component } from 'react';
import './Styles/App.css';
import TopNav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainArea from './MainArea';
import LogIn from './LogIn';
import LoginNav from './LoginNav';
import './Styles/App.css';
import frontPage from './components/Etusivu/frontPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={LoginNav} />
          <Route path="/" exact component={LogIn} />
          <Route path="/main" exact component={frontPage} />
          <Route path="/main/tables" exact component={TopNav} />
          <Route path="/main/tables" component={MainArea} />
        </div>
      </Router>
    );
  }
}

export default App;
