import React, { Component } from 'react';
import { Container, Row, Col, Table, Alert } from 'reactstrap';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { GeoHash } from 'geohash';
import contract from 'truffle-contract';
import SafeRouteContract from './../../build/contracts/SafeRoute.json';

import MapComponent from './MapComponent';

class SafeRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      driver: '',
      dossierHash: '',
      dossierPointer: '',
      markers: []
    };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    const { entrypoint, coinbase, token, web3, roadManagers } = this.props;

    const safeRoute = contract(SafeRouteContract);
    safeRoute.setProvider(web3.currentProvider);

    var route = await safeRoute.new(
      this.state.driver,
      this.state.dossierHash,
      this.state.dossierPointer,
      token,
      { from: coinbase }
    )

    this.state.markers.forEach(async (item, index) => {
      var hash = GeoHash.encodeGeoHash(item.lat, item.lng);
      await route.addLocation(hash, this.props.roadManagers[index].address, 100, { from: coinbase });
      console.log("Add location", index, item, hash);
    })

    await entrypoint.addRoute(route.address, { from: coinbase });

    const { onSubmitted } = this.props;
    if (onSubmitted) {
      onSubmitted();
    }
  }

  render() {
    return (
      <Container>
        {this.props.roadManagers.length ?
          null :
          <Alert color="danger">
            Please add at least one road manager
          </Alert>
        }
        <Row>
          <Col>
            <Form>
              <FormGroup>
                <Label for="driver">Driver</Label>
                <Input id="driver" onChange={event => this.setState({ driver: event.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="dossierHash">Dossier Hash</Label>
                <Input id="dossierHash" onChange={event => this.setState({ dossierHash: event.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="dossierPointer">Dossier Pointer</Label>
                <Input id="dossierPointer" onChange={event => this.setState({ dossierPointer: event.target.value })} />
              </FormGroup>
              <MapComponent
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `300px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                markers={this.state.markers}
                onClick={(e) => {
                  if (this.state.markers.length >= this.props.roadManagers.length) return;
                  this.setState({
                    markers: [...this.state.markers, { lat: e.latLng.lat(), lng: e.latLng.lng() }]
                  });
                }}
              />
              {this.state.markers.length ?
                <Table style={{ marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th>GeoHash</th>
                      <th>Road manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.markers.map((item, index) => (
                        <tr key={index}>
                        <td>{GeoHash.encodeGeoHash(item.lat, item.lng)}</td>
                          <td>{this.props.roadManagers[index].address}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table> : null
              }
              <Button
                onClick={this.submit}
                style={{ marginTop: 20 }}
                disabled={!this.props.roadManagers.length}>Create</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SafeRoute;