import React from 'react';
import { Container, Nav, NavItem, NavLink } from 'reactstrap';

const Header = () => {
  return (
    <div className="App-header">
      <Container>
        <header>
          <h1 className="App-title">SafeRoute</h1>
        </header>
        <Nav style={{display: 'inline-flex', color: '#fff'}}>
          <NavItem>
            <NavLink href="/">RDW</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/driver">Driver</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/info">Info</NavLink>
          </NavItem>
        </Nav>
      </Container>
    </div>
  );
}

export default Header;