import React, { Component } from 'react'
import RDWTokenContract from '../build/contracts/RDWToken.json'
import SafeRouteContract from '../build/contracts/SafeRoute.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiate()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  async instantiate() {
    const contract = require('truffle-contract')
    const token = contract(RDWTokenContract)
    token.setProvider(this.state.web3.currentProvider)
    const safeRoute = contract(SafeRouteContract)
    safeRoute.setProvider(this.state.web3.currentProvider)

    var tokenInstance = await token.at(process.env.REACT_APP_TOKEN_CONTRACT)
    var safeRouteInstance = await token.at(process.env.REACT_APP_SAFE_ROUTE_CONTRACT)

    console.log(tokenInstance)
    console.log(safeRouteInstance)
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Safe Route</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your app is installed and ready.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
