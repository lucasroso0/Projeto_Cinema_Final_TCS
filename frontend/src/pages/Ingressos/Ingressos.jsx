import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './ingresso.css';

export default function Ingresso() {
  const [ingresso, setIngresso] = useState({
    filme: '',
    sala: '',
    sessao: '',
    quantidade: 1,
  });

  const [listaFilmes, setListaFilmes] = useState([]);
  const [listaIngressos, setListaIngressos] = useState([]);

  useEffect(() => {
    // Carregar filmes
    const filmesSalvos = localStorage.getItem('filmes');
    if (filmesSalvos) {
      setListaFilmes(JSON.parse(filmesSalvos));
    }
    // Carregar ingressos
    const ingressosSalvos = localStorage.getItem('ingressos');
    if (ingressosSalvos) {
      setListaIngressos(JSON.parse(ingressosSalvos));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngresso({ ...ingresso, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ingresso.filme) {
      alert('Selecione um filme.');
      return;
    }
    if (!ingresso.sala.trim()) {
      alert('Informe a sala.');
      return;
    }
    if (!ingresso.sessao.trim()) {
      alert('Informe a sessão.');
      return;
    }
    if (ingresso.quantidade < 1) {
      alert('Quantidade mínima é 1.');
      return;
    }

    // Adicionar novo ingresso à lista
    const novoIngresso = { ...ingresso };
    const ingressosAtualizados = [...listaIngressos, novoIngresso];

    // Salvar no localStorage
    localStorage.setItem('ingressos', JSON.stringify(ingressosAtualizados));
    setListaIngressos(ingressosAtualizados);

    alert(`Ingresso para "${ingresso.filme}" comprado com sucesso!`);

    // Resetar o formulário
    setIngresso({
      filme: '',
      sala: '',
      sessao: '',
      quantidade: 1,
    });
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
      <div className="ingresso-card">
        <h2 className="ingresso-title">🎟️ Compra de Ingresso</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="filme">Filme</label>
          <select
            id="filme"
            name="filme"
            value={ingresso.filme}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="" disabled>
              -- Selecione o filme --
            </option>
            {listaFilmes.map((f, i) => (
              <option key={i} value={f.titulo}>
                {f.titulo} ({f.ano})
              </option>
            ))}
          </select>

          <Input
            label="Sala"
            name="sala"
            value={ingresso.sala}
            onChange={handleChange}
          />
          <Input
            label="Sessão"
            name="sessao"
            value={ingresso.sessao}
            onChange={handleChange}
          />
          <Input
            label="Quantidade"
            name="quantidade"
            type="number"
            min="1"
            value={ingresso.quantidade}
            onChange={handleChange}
          />

          <div className="text-end mt-4">
            <Button type="submit" variant="success">Comprar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
