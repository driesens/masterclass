import React, { Component } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Card, CardBody, CardTitle, Table } from 'reactstrap';
import contract from 'truffle-contract';

import getWeb3 from './../utils/getWeb3';
import RDWContract from './../../build/contracts/RDW.json';
import SafeRouteView from './SafeRouteView';
import Coinbase from './Coinbase';

class Driver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      modal: false,
      selected: {},
      contract: {},
      coinbase: '',
      routes: []
    };

    this.toggle = this.toggle.bind(this);

    getWeb3
      .then(results => {
        this.load(results.web3);
      })
      .catch(() => {
        console.log('Error finding web3.')
      });
  }

  async load(web3) {
    const rdw = contract(RDWContract);
    rdw.setProvider(web3.currentProvider);

    var rdwInstance = await rdw.at(process.env.REACT_APP_CONTRACT);

    var routesAmount = await rdwInstance.getRoutesAmount();
    console.log('routesAmount', parseInt(routesAmount))

    var routes = [];
    for (var i = 0; i < routesAmount; i++) {
      var route = await rdwInstance.getRoute(i);
      routes.push(route);
    }

    this.setState({
      web3: web3,
      contract: rdwInstance,
      coinbase: web3.eth.coinbase,
      routes: routes
    });
    console.log("state", this.state);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} style={{ maxWidth: 800 }}>
          <ModalHeader toggle={this.toggle}>Safe Route View</ModalHeader>
          <ModalBody>
            <SafeRouteView
              item={this.state.selected}
              web3={this.state.web3}
              coinbase={this.state.coinbase} />
          </ModalBody>
        </Modal>
        <Row style={{ marginTop: 20 }}>
          <Col sm={{ size: 12 }} style={{ marginTop: 20 }}>
            <Card>
              <CardBody>
                <CardTitle>Routes</CardTitle>
                <Row style={{ textAlign: 'left' }} >
                  <Col sm={{ size: 12 }}>
                    {this.state.routes.length ?
                      <Table style={{ marginTop: 20 }}>
                        <thead>
                          <tr>
                            <th>Contract</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.routes.map((item, index) => (
                              <tr key={index}>
                                <td>{item}</td>
                                <td>
                                  <Button onClick={() => { this.setState({ selected: item }); this.toggle(); }}>Open</Button>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table> : null
                    }
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Coinbase coinbase={this.state.coinbase} />
      </Container >
    );
  }
}

export default Driver;