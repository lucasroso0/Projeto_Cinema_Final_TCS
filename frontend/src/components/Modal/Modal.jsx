import React from 'react';
import { Modal as BsModal, Button } from 'react-bootstrap';

export default function Modal({ show, onHide, title, children }) {
  return (
    <BsModal show={show} onHide={onHide} centered>
      <BsModal.Header closeButton>
        <BsModal.Title>{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
      <BsModal.Footer>
        <Button variant="secondary" onClick={onHide}>Fechar</Button>
      </BsModal.Footer>
    </BsModal>
  );
}
