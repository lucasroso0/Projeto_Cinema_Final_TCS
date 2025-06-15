import React, { useState } from 'react';
import './SeatPickerModal.css';
import Button from '../Button/Button';

export default function SeatPickerModal({ isOpen, onClose, capacidade, assentosOcupados, onSelectSeat }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleSeatClick = (seatNumber) => {
    // Não permite clicar em assentos já ocupados
    if (assentosOcupados.includes(seatNumber)) {
      return;
    }
    setSelectedSeat(seatNumber);
  };

  const handleConfirm = () => {
    onSelectSeat(selectedSeat);
    onClose();
  };

  // Cria um array com todos os assentos, de 1 até a capacidade da sala
  const todosAssentos = Array.from({ length: capacidade }, (_, i) => i + 1);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Selecione seu Assento</h2>
        <div className="seat-grid">
          {todosAssentos.map((seatNumber) => {
            const isOccupied = assentosOcupados.includes(seatNumber);
            const isSelected = selectedSeat === seatNumber;
            
            let seatClass = 'seat';
            if (isOccupied) seatClass += ' occupied';
            if (isSelected) seatClass += ' selected';

            return (
              <div
                key={seatNumber}
                className={seatClass}
                onClick={() => handleSeatClick(seatNumber)}
              >
                {seatNumber}
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedSeat}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}