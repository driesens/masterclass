import React from 'react';
import { Container, Card, CardBody, CardTitle, Table } from 'reactstrap';

const Info = () => {
  return (
    <Container style={{ marginTop: 20 }}>
      <Card>
        <CardBody>
          <CardTitle>Roles</CardTitle>
          <Table style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Public key</th>
                <th>Private key</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RDW</td>
                <td>0x7c005e9f73fd859f62a4f2c93bf91644ed481e3d</td>
                <td>7a8efcce118b173c327cbf31975843ad3b2721a9dee19a1c01d37cc018bb6618</td>
              </tr>
              <tr>
                <td>Driver</td>
                <td>0x49492f29270b15c5fa192fc84bc53a2a33de701e</td>
                <td>93e18ebb4d201f9af2669bc1d1d50bfc7880bc68669692036cda4512ecd4b34b</td>
              </tr>
              <tr>
                <td>Road Manager #1</td>
                <td>0x8a8ad4cabc07590e6a7d2178067d098e3ec3724b</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Road Manager #2</td>
                <td>0xcab1e4f5a7ec60431fa9c2444b4e3180f43a43c3</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
      Notes: Roles defined for Ethereum RPC emulator. Command to run:
      <pre>> ganache-cli -m "vacant monster sell rally jelly wait sadness until combine refuse clarify vote"</pre>
    </Container>
  );
}

export default Info;