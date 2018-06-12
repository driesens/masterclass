import React, { Component } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import contract from 'truffle-contract';
import SafeRouteContract from './../../build/contracts/SafeRoute.json';

class SafeRouteView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      driver: '',
      dossierHash: '',
      dossierPointer: '',
      balance: 0,
      roadManagers: [],
      locations: []
    };

    this.visit = this.visit.bind(this);

    this.load();
  }

  async visit(location) {
    console.log("Visit", location);

    const safeRoute = contract(SafeRouteContract);
    safeRoute.setProvider(this.props.web3.currentProvider);

    const instance = await safeRoute.at(this.props.item);
    instance.visit(location.roadManager, { from: this.props.coinbase })
  }

  async load() {
    const safeRoute = contract(SafeRouteContract);
    safeRoute.setProvider(this.props.web3.currentProvider);

    const instance = await safeRoute.at(this.props.item);
    const locationsAmount = await instance.getLocationsAmount();

    const locations = [];
    for (var i = 0; i < locationsAmount; i++) {
      const result = await instance.getLocation(i);

      locations.push({
        location: result[0],
        roadManager: result[1],
        price: parseInt(result[2])
      });
    }

    this.setState({
      driver: await instance.getDriver(),
      dossierHash: await instance.getDossierHash(),
      dossierPointer: await instance.getDossierPointer(),
      balance: await instance.getBalance(),
      locations: locations,
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={{ size: 4 }}>
            <strong>Driver</strong>
          </Col>
          <Col sm={{ size: 8 }}>
            {this.state.driver}
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 4 }}>
            <strong>Dossier Hash</strong>
          </Col>
          <Col sm={{ size: 8 }}>
            <div style={{ overflow: 'hidden' }}>
              {this.state.dossierHash}
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 4 }}>
            <strong>Dossier Pointer</strong>
          </Col>
          <Col sm={{ size: 8 }}>
            {this.state.dossierPointer}
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 4 }}>
            <strong>Balance</strong>
          </Col>
          <Col sm={{ size: 8 }}>
            {parseInt(this.state.balance)}
          </Col>
        </Row>
        {this.state.locations.length ?
          <Table style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>GeoHash</th>
                <th>Road Manager</th>
                <th>Price</th>
                {this.state.driver == this.props.coinbase ? <th></th> : null}
              </tr>
            </thead>
            <tbody>
              {
                this.state.locations.map((item, index) => (
                  <tr key={index}>
                    <td>{item.location}</td>
                    <td>{item.roadManager}</td>
                    <td>{item.price}</td>
                    {this.state.driver == this.props.coinbase ?
                      <th>
                        <Button onClick={() => this.visit(item)}>Visit</Button>
                      </th> :
                      null
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table> : null
        }
      </Container>
    );
  }
}

export default SafeRouteView;