import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

class RoadManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    const { contract, coinbase } = this.props;
    await contract.addRoadManager(this.state.value, { from: coinbase });

    const { onSubmitted } = this.props;
    if (onSubmitted) {
      onSubmitted();
    }
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input id="address" onChange={event => this.setState({ value: event.target.value })} />
        </FormGroup>
        <Button onClick={this.submit}>Add</Button>
      </Form>
    );
  }
}

export default RoadManager;