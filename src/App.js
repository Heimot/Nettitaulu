import React, { Component } from 'react';
import TopNav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainArea from './MainArea';
import LogIn from './LogIn';
import LoginNav from './LoginNav';
import frontPage from './components/Etusivu/frontPage';
import ErrorBoundary from './components/errorCatcher/ErrorBoundary';
import Rullakot from './components/rullakot/rullakot';
import Calendar from './components/calendar/calendar';
import CalendarNav from './components/calendar/calendarNav';
import RullakotNav from './components/rullakot/rullakotNav';

setInterval(function () {
  if (sessionStorage.getItem('expTime') < Date.now() / 1000 && window.location.pathname !== '/') {
    sessionStorage.removeItem('userData')
  }
}, 1000)

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Route path="/" exact component={LoginNav} />
            <Route path="/" exact component={LogIn} />
            <Route path="/main" exact component={frontPage} />
            <Route path="/main/tables" component={TopNav} />
            <Route path="/main/tables" exact component={MainArea} />
            <Route path="/main/tables/rullakot" component={RullakotNav} />
            <Route path="/main/tables/rullakot" component={Rullakot} />
            <Route path='/main/calendar' component={CalendarNav} />
            <Route path="/main/calendar" component={Calendar} />
          </div>
        </Router>
      </ErrorBoundary >
    );
  }
}

export default App;
