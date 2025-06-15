import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">🎬 Cinema</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/filme">Filme</Nav.Link>
          <Nav.Link as={Link} to="/sala">Sala</Nav.Link>
          <Nav.Link as={Link} to="/sessao">Sessão</Nav.Link>
          <Nav.Link as={Link} to="/ingressos">Ingressos</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
