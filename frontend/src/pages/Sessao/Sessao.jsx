import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Sessao.css';

export default function Sessao() {
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [sessao, setSessao] = useState({
    filmeId: '',
    salaId: '',
    dataHora: ''
  });

  useEffect(() => {
    const filmesLS = JSON.parse(localStorage.getItem('filmes')) || [];
    const salasLS = JSON.parse(localStorage.getItem('salas')) || [];
    setFilmes(filmesLS);
    setSalas(salasLS);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessao({ ...sessao, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessao.filmeId || !sessao.salaId || !sessao.dataHora) {
      alert('Preencha todos os campos');
      return;
    }
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const novaSessao = { 
      id: Date.now(), 
      ...sessao 
    };
    localStorage.setItem('sessoes', JSON.stringify([...sessoes, novaSessao]));
    alert('Sessão cadastrada com sucesso!');
    setSessao({ filmeId: '', salaId: '', dataHora: '' });
  };

  return (
    <div className="sessao-container">
      <div className="sessao-card">
        <h2 className="sessao-title">🗓️ Cadastro de Sessão</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="filmeId">Filme</label>
          <select
            id="filmeId"
            name="filmeId"
            value={sessao.filmeId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Selecione o filme</option>
            {filmes.map(f => (
              <option key={f.id || f.titulo} value={f.id || f.titulo}>{f.titulo}</option>
            ))}
          </select>

          <label className="form-label" htmlFor="salaId">Sala</label>
          <select
            id="salaId"
            name="salaId"
            value={sessao.salaId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Selecione a sala</option>
            {salas.map(s => (
              <option key={s.id || s.nome} value={s.id || s.nome}>{s.nome}</option>
            ))}
          </select>

          <label className="form-label" htmlFor="dataHora">Data e Hora</label>
          <Input
            id="dataHora"
            name="dataHora"
            type="datetime-local"
            value={sessao.dataHora}
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
