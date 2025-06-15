import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './filme.css';


const API_URL = 'http://localhost:3001/filme';

export default function Filme() {
  const [filme, setFilme] = useState({
    titulo: '',
    duracao: '',
    ano: '',
    diretor: ''
  });

  // O estado agora começa como uma lista vazia.
  const [listaFilmes, setListaFilmes] = useState([]);

  // Função para buscar os filmes do backend
  const fetchFilmes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setListaFilmes(data); // Atualiza o estado com os dados do backend
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      alert('Não foi possível carregar os filmes do servidor.');
    }
  };

  // useEffect para buscar os filmes do backend QUANDO o componente carregar
  useEffect(() => {
    fetchFilmes();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Converte para número se o campo for de duração ou ano
    const valorTratado = name === 'duracao' || name === 'ano' ? parseInt(value, 10) || '' : value;
    setFilme({ ...filme, [name]: valorTratado });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filme.titulo.trim()) {
      alert('O título do filme é obrigatório.');
      return;
    }

    try {
      // Envia os dados do novo filme para o backend (POST)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filme),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar o filme.');
      }

      alert('Filme cadastrado com sucesso!');
      setFilme({ titulo: '', duracao: '', ano: '', diretor: '' }); // Limpa o formulário
      fetchFilmes(); // Atualiza a lista de filmes buscando os dados mais recentes do backend

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Ocorreu um erro ao cadastrar o filme.');
    }
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
          {/* Inputs continuam os mesmos */}
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
              {/* Agora a key pode ser o ID do filme vindo do banco de dados */}
              {listaFilmes.map((f) => (
                <li key={f.id}>
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