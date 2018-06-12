import React, { Component } from 'react'
import { Switch, Route } from "react-router-dom";
import { Container, Nav, NavItem, NavLink } from 'reactstrap';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import Header from './components/Header';
import Home from './components/Home';
import Driver from './components/Driver';
import Info from './components/Info';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/driver" component={Driver} />
          <Route exact path="/info" component={Info} />
        </Switch>
      </div>
    );
  }
}

export default App
