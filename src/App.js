import React, { Component } from 'react';
import './App.css';
import TopNav from './Nav';
import { BrowserRouter, Route } from 'react-router-dom';
import MainArea from './MainArea';
import ShowTable from './Table';

class App extends Component {
  render() {
    return (
      <div className="App">

        <TopNav />

        <MainArea />

        <ShowTable />

      </div>
    );
  }
}

export default App;
