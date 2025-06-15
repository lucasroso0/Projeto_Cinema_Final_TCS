import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Sala.css';

// URL do seu endpoint da API para salas
const API_URL = 'http://localhost:3001/salas';

export default function Sala() {
  // Estado para os campos do formulário
  const [sala, setSala] = useState({
    nome: '',
    capacidade: '',
  });

  // Estado para armazenar a lista de salas vindas do backend
  const [listaSalas, setListaSalas] = useState([]);

  // Função para buscar as salas da API
  const fetchSalas = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao carregar as salas.');
      }
      const data = await response.json();
      setListaSalas(data);
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    }
  };

  // useEffect para buscar as salas quando o componente carregar
  useEffect(() => {
    fetchSalas();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se o campo for 'capacidade', converte para número
    const valorTratado = name === 'capacidade' ? parseInt(value, 10) || '' : value;
    setSala({ ...sala, [name]: valorTratado });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sala.nome.trim() || !sala.capacidade) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      // Envia os dados para a API criar a nova sala
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sala),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Exibe a mensagem de erro específica do backend (ex: "sala já existe")
        throw new Error(errorData.message || 'Erro ao cadastrar a sala.');
      }

      alert('Sala cadastrada com sucesso!');
      setSala({ nome: '', capacidade: '' }); // Limpa o formulário
      fetchSalas(); // Atualiza a lista de salas na tela

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/Sala_Cinema.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
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
            min="1"
            value={sala.capacidade}
            onChange={handleChange}
          />
          <div className="text-end mt-4">
            <Button type="submit" variant="success">Salvar</Button>
          </div>
        </form>

        {/* Adicionei esta seção para exibir as salas cadastradas */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Salas Cadastradas:</h3>
          {listaSalas.length === 0 ? (
            <p>Nenhuma sala cadastrada ainda.</p>
          ) : (
            <ul className="sala-list">
              {listaSalas.map((s) => (
                <li key={s.id}>
                  <strong>{s.nome}</strong> - Capacidade: {s.capacidade} pessoas
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}