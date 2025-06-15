import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Sessao.css';

const API_URL_SESSOES = 'http://localhost:3001/sessoes';
const API_URL_FILMES = 'http://localhost:3001/filme'; // Corrigido
const API_URL_SALAS = 'http://localhost:3001/salas';

export default function Sessao() {
  const [sessao, setSessao] = useState({
    filmeId: '',
    salaId: '',
    horario: '',
    valorIngresso: '',
  });

  const [listaFilmes, setListaFilmes] = useState([]);
  const [listaSalas, setListaSalas] = useState([]);
  const [listaSessoes, setListaSessoes] = useState([]);

  const carregarDadosIniciais = async () => {
    try {
      const [sessoesRes, filmesRes, salasRes] = await Promise.all([
        fetch(API_URL_SESSOES),
        fetch(API_URL_FILMES),
        fetch(API_URL_SALAS),
      ]);

      if (!sessoesRes.ok || !filmesRes.ok || !salasRes.ok) {
        throw new Error('Falha ao carregar dados iniciais do servidor.');
      }

      const sessoesData = await sessoesRes.json();
      const filmesData = await filmesRes.json();
      const salasData = await salasRes.json();

      setListaSessoes(sessoesData);
      setListaFilmes(filmesData);
      setListaSalas(salasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const valorTratado = (name === 'filmeId' || name === 'salaId' || name === 'valorIngresso') 
      ? parseFloat(value) || '' 
      : value;
    setSessao({ ...sessao, [name]: valorTratado });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessao.filmeId || !sessao.salaId || !sessao.horario || !sessao.valorIngresso) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(API_URL_SESSOES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...sessao,
            horario: new Date(sessao.horario).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar a sessão.');
      }

      alert('Sessão cadastrada com sucesso!');
      setSessao({ filmeId: '', salaId: '', horario: '', valorIngresso: '' });
      carregarDadosIniciais();

    } catch (error) {
        console.error("Erro ao cadastrar sessão:", error);
        alert(error.message);
    }
  };

  return (
    <div className="sessao-container">
      <div className="sessao-card">
        <h2 className="sessao-title">🗓️ Cadastro de Sessão</h2>
        {/* O formulário continua igual */}
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="filmeId">Filme</label>
          <select
            id="filmeId"
            name="filmeId"
            value={sessao.filmeId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="" disabled>-- Selecione o filme --</option>
            {listaFilmes.map(f => (
              <option key={f.id} value={f.id}>{f.titulo}</option>
            ))}
          </select>

          <label className="form-label" htmlFor="salaId">Sala</label>
          <select
            id="salaId"
            name="salaId"
            value={sessao.salaId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="" disabled>-- Selecione a sala --</option>
            {listaSalas.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>

          <Input
            label="Data e Hora"
            name="horario"
            type="datetime-local"
            value={sessao.horario}
            onChange={handleChange}
          />

          <Input
            label="Valor do Ingresso (R$)"
            name="valorIngresso"
            type="number"
            step="0.01"
            min="0"
            value={sessao.valorIngresso}
            onChange={handleChange}
          />

          <div className="text-end mt-4">
            <Button type="submit" variant="success">Salvar</Button>
          </div>
        </form>
        
        {/* CORREÇÃO APLICADA AQUI */}
        <div style={{ marginTop: '2rem' }}>
            <h3>Sessões Cadastradas:</h3>
            {listaSessoes.length === 0 ? (
                <p>Nenhuma sessão cadastrada ainda.</p>
            ) : (
                <ul className="sessao-list">
                    {listaSessoes.map((s) => (
                        <li key={s.id}>
                            <strong>{s.filme?.titulo || 'Filme não encontrado'}</strong> na <strong>Sala {s.sala?.nome || 'Sala não encontrada'}</strong> 
                            <br />
                            Horário: {new Date(s.horario).toLocaleString('pt-BR')}
                            {/* Verificação para evitar o erro. Só mostra o preço se ele existir e for um número. */}
                            {typeof s.valorIngresso === 'number' ? ` - Preço: R$ ${s.valorIngresso.toFixed(2)}` : ''}
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
}