import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './filme.css';

export default function Filme() {
  const [filme, setFilme] = useState({
    titulo: '',
    duracao: '',
    ano: '',
    diretor: ''
  });

  const [listaFilmes, setListaFilmes] = useState(() => {
    // Carrega do localStorage na inicialização
    const filmesSalvos = localStorage.getItem('filmes');
    return filmesSalvos ? JSON.parse(filmesSalvos) : [];
  });

  useEffect(() => {
    // Sempre que listaFilmes mudar, salva no localStorage
    localStorage.setItem('filmes', JSON.stringify(listaFilmes));
  }, [listaFilmes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilme({ ...filme, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação simples para não cadastrar filme vazio
    if (!filme.titulo.trim()) {
      alert('O título do filme é obrigatório.');
      return;
    }

    setListaFilmes([...listaFilmes, filme]);

    alert('Filme cadastrado com sucesso!');
    setFilme({ titulo: '', duracao: '', ano: '', diretor: '' });
  };

  return (
    <div style={{
      backgroundImage: "url('/images/Sala_Cinema.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="filme-card">
        <h2 className="filme-title">🎬 Cadastro de Filme</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Título"
            name="titulo"
            value={filme.titulo}
            onChange={handleChange}
          />
          <Input
            label="Duração (minutos)"
            name="duracao"
            type="number"
            value={filme.duracao}
            onChange={handleChange}
          />
          <Input
            label="Ano de Lançamento"
            name="ano"
            type="number"
            value={filme.ano}
            onChange={handleChange}
          />
          <Input
            label="Diretor"
            name="diretor"
            value={filme.diretor}
            onChange={handleChange}
          />
          <div className="text-end mt-4">
            <Button type="submit" variant="success">Salvar</Button>
          </div>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <h3>Filmes cadastrados:</h3>
          {listaFilmes.length === 0 ? (
            <p>Nenhum filme cadastrado ainda.</p>
          ) : (
            <ul>
              {listaFilmes.map((f, index) => (
                <li key={index}>
                  {f.titulo} ({f.ano}), {f.duracao} min - Diretor: {f.diretor}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
