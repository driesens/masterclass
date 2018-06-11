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
      web3: null,
      token: {},
      contract: {},
      balance: 0,
      balanceRM: 0,
    }

    this.onClick = this.onClick.bind(this);
    this.onWithdrawClick = this.onWithdrawClick.bind(this);
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
    var safeRouteInstance = await safeRoute.at(process.env.REACT_APP_SAFE_ROUTE_CONTRACT)
    var balance = await tokenInstance.balanceOf(safeRouteInstance.address);
    var balanceRM = await tokenInstance.balanceOf("0x49492f29270b15c5fa192fc84bc53a2a33de701e");

    this.setState({
      token: tokenInstance,
      contract: safeRouteInstance,
      balance: parseInt(balance),
      balanceRM: parseInt(balanceRM)
    });
    console.log(tokenInstance)
    console.log(safeRouteInstance)
  }

  async onClick() {
    var result = await this.state.contract
      .addRoadManager("0x49492f29270b15c5fa192fc84bc53a2a33de701e", 10000);
    var balance = await this.state.token.balanceOf(this.state.contract.address);
    this.setState({ balance: parseInt(balance) });
  }

  async onWithdrawClick() {
    var result = await this.state.contract.withdraw({ from: "0x49492f29270b15c5fa192fc84bc53a2a33de701e" });
    var balance = await this.state.token.balanceOf("0x49492f29270b15c5fa192fc84bc53a2a33de701e");
    this.setState({ balanceRM: parseInt(balance) });
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
              <input type="button"
                value="add road manager"
                onClick={this.onClick} />
              <div>Balance of contract: <span>{this.state.balance}</span></div>
              <input type="button"
                value="withdraw"
                onClick={this.onWithdrawClick} />
              <div>Balance of road manager: <span>{this.state.balanceRM}</span></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
