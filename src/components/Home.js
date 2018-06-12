import React, { Component } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Card, CardBody, CardTitle, Table } from 'reactstrap';
import contract from 'truffle-contract';

import getWeb3 from './../utils/getWeb3'
import RDWContract from './../../build/contracts/RDW.json';
import RDWTokenContract from './../../build/contracts/RDWToken.json';
import SafeRouteContract from './../../build/contracts/SafeRoute.json';

import SafeRoute from './SafeRoute';
import SafeRouteView from './SafeRouteView';
import RoadManager from './RoadManager';
import Coinbase from './Coinbase';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      modal: false,
      modalV: false,
      modalRM: false,
      selected: {},
      contract: {},
      coinbase: '',
      token: '',
      roadManagers: [],
      routes: []
    };

    this.toggle = this.toggle.bind(this);
    this.toggleV = this.toggleV.bind(this);
    this.toggleRM = this.toggleRM.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.closeCardRM = this.closeCardRM.bind(this);

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
    const token = contract(RDWTokenContract);
    token.setProvider(web3.currentProvider);

    var rdwInstance = await rdw.at(process.env.REACT_APP_CONTRACT);
    var tokenAddress = await rdwInstance.getTokenContract();
    var tokenInstance = await token.at(tokenAddress);
    var roadManagersAmount = await rdwInstance.getRoadManagersAmount();

    var roadManagers = [];
    for (var i = 0; i < roadManagersAmount; i++) {
      var roadManager = await rdwInstance.getRoadManager(i);
      var balance = await tokenInstance.balanceOf(roadManager);
      roadManagers.push({ address: roadManager, balance: parseInt(balance) })
    }

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
      token: tokenAddress,
      roadManagers: roadManagers,
      routes: routes
    });
    console.log("state", this.state);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleRM() {
    this.setState({
      modalRM: !this.state.modalRM,
    });
  }

  toggleV() {
    this.setState({
      modalV: !this.state.modalV,
    });
  }

  closeCard() {
    this.toggle();
    this.load();
  }

  closeCardRM() {
    this.toggleRM();
    this.load();
  }

  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} style={{ maxWidth: 800 }}>
          <ModalHeader toggle={this.toggle}>Safe Route</ModalHeader>
          <ModalBody>
            <SafeRoute
              entrypoint={this.state.contract}
              coinbase={this.state.coinbase}
              token={this.state.token}
              roadManagers={this.state.roadManagers}
              web3={this.state.web3}
              onSubmitted={this.closeCard}
              item={this.state.selected} />
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.modalV} toggle={this.toggleV} className={this.props.className} style={{ maxWidth: 800 }}>
          <ModalHeader toggle={this.toggleV}>Safe Route View</ModalHeader>
          <ModalBody>
            <SafeRouteView
              item={this.state.selected}
              web3={this.state.web3}
              coinbase={this.state.coinbase} />
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.modalRM} toggle={this.toggleRM} className={this.props.className}>
          <ModalHeader toggle={this.toggleRM}>Road Manager</ModalHeader>
          <ModalBody>
            <RoadManager contract={this.state.contract} coinbase={this.state.coinbase} onSubmitted={this.closeCardRM} />
          </ModalBody>
        </Modal>
        <Row style={{ marginTop: 20 }}>
          <Col sm={{ size: 5 }}>
            <Card>
              <CardBody>
                <CardTitle>Info</CardTitle>
                <Row style={{ textAlign: 'left' }} >
                  <Col sm={{ size: 12 }}>
                    <strong>Token contract:</strong>
                  </Col>
                  <Col sm={{ size: 12 }}>{this.state.token}</Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm={{ size: 7 }}>
            <Card>
              <CardBody>
                <CardTitle>Road Managers</CardTitle>
                <Row style={{ textAlign: 'left' }} >
                  <Col sm={{ size: 12 }}>
                    {this.state.roadManagers.map((item, index) =>
                      <Row style={{ textAlign: 'left' }} key={index}>
                        <Col sm={{ size: 9 }}>
                          {item.address}
                        </Col>
                        <Col sm={{ size: 3 }}>
                          {item.balance}
                        </Col>
                      </Row>
                    )}
                  </Col>
                  <Col sm={{ size: 12 }} style={{ marginTop: 20 }}>
                    <Button onClick={this.toggleRM}>+ Add Road Manager</Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
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
                                  <Button onClick={() => { this.setState({ selected: item }); this.toggleV(); }}>Open</Button>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table> : null
                    }
                  </Col>
                  <Col sm={{ size: 12 }} style={{ marginTop: 20 }}>
                    <Button onClick={this.toggle}>+ Add Safe Route</Button>
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

export default Home;