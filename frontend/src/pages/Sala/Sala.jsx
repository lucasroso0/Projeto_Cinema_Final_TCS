import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Sala.css';

export default function Sala() {
  const [sala, setSala] = useState({
    nome: '',
    capacidade: ''
  });

  const [listaSalas, setListaSalas] = useState([]);

  useEffect(() => {
    const salasSalvas = localStorage.getItem('salas');
    if (salasSalvas) {
      setListaSalas(JSON.parse(salasSalvas));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSala({ ...sala, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sala.nome.trim() || !sala.capacidade) {
      alert('Preencha todos os campos.');
      return;
    }

    const novaSala = { ...sala };
    const salasAtualizadas = [...listaSalas, novaSala];
    localStorage.setItem('salas', JSON.stringify(salasAtualizadas));
    setListaSalas(salasAtualizadas);

    alert('Sala cadastrada com sucesso!');
    setSala({ nome: '', capacidade: '' });
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/Sala_Cinema.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <div className="sala-card">
        <h2 className="sala-title">🎞️ Cadastro de Sala</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome da Sala"
            name="nome"
            value={sala.nome}
            onChange={handleChange}
          />
          <Input
            label="Capacidade"
            name="capacidade"
            type="number"
            value={sala.capacidade}
            onChange={handleChange}
          />
          <div className="text-end mt-4">
            <Button type="submit" variant="success">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
