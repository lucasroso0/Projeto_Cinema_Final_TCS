import React, { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import SeatPickerModal from '../../components/SeatPickerModal/SeatPickerModal';
import './ingresso.css';

const API_URL_INGRESSOS = 'http://localhost:3001/ingressos';
const API_URL_SESSOES = 'http://localhost:3001/sessoes';

export default function Ingresso() {
  const [novoIngresso, setNovoIngresso] = useState({
    sessaoId: '',
    nomeCliente: '',
    assento: '',
    tipo: 'INTEIRA',
  });

  const [listaSessoes, setListaSessoes] = useState([]);
  const [listaIngressos, setListaIngressos] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seatMap, setSeatMap] = useState({ capacidadeTotal: 0, assentosOcupados: [] });

  const carregarDadosIniciais = async () => {
    try {
      const [sessoesRes, ingressosRes] = await Promise.all([
        fetch(API_URL_SESSOES),
        fetch(API_URL_INGRESSOS)
      ]);
      
      if (!sessoesRes.ok || !ingressosRes.ok) throw new Error('Falha ao carregar dados.');

      const sessoesData = await sessoesRes.json();
      const ingressosData = await ingressosRes.json();
      
      setListaSessoes(sessoesData);
      setListaIngressos(ingressosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert(error.message);
    }
  };
  
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const fetchSeatMap = async (sessaoId) => {
    if (!sessaoId) return;
    try {
      const response = await fetch(`${API_URL_SESSOES}/${sessaoId}/assentos`);
      if (!response.ok) throw new Error('Falha ao buscar assentos para esta sessão.');
      const data = await response.json();
      setSeatMap(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setSeatMap({ capacidadeTotal: 0, assentosOcupados: [] });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericId = name === 'sessaoId';
    const valorTratado = isNumericId ? parseInt(value, 10) : value;
    
    setNovoIngresso({ ...novoIngresso, [name]: valorTratado, assento: '' });

    if (name === 'sessaoId') {
      fetchSeatMap(valorTratado);
    }
  };

  const handleSelectSeat = (seatNumber) => {
    setNovoIngresso({ ...novoIngresso, assento: seatNumber });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novoIngresso.sessaoId || !novoIngresso.nomeCliente.trim() || !novoIngresso.assento) {
      alert('Preencha todos os campos, incluindo a seleção do assento.');
      return;
    }

    try {
      const payload = {
        sessaoId: novoIngresso.sessaoId,
        nomeCliente: novoIngresso.nomeCliente,
        assento: novoIngresso.assento,
      };

      const response = await fetch(API_URL_INGRESSOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao comprar o ingresso.');
      }
      
      alert('Ingresso comprado com sucesso!');
      setNovoIngresso({ sessaoId: '', nomeCliente: '', assento: '', tipo: 'INTEIRA' });
      carregarDadosIniciais();

    } catch (error) {
      console.error('Erro na compra:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <SeatPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        capacidade={seatMap.capacidadeTotal}
        assentosOcupados={seatMap.assentosOcupados}
        onSelectSeat={handleSelectSeat}
      />
      <div className="ingresso-container">
        <div className="ingresso-card">
          <h2 className="ingresso-title">🎟️ Compra de Ingresso</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="sessaoId">Sessão</label>
            <select
              id="sessaoId" name="sessaoId" value={novoIngresso.sessaoId}
              onChange={handleChange} className="form-control" required
            >
              <option value="" disabled>-- Selecione a sessão --</option>
              {listaSessoes.map((sessao) => (
                <option key={sessao.id} value={sessao.id}>
                  {sessao.filme?.titulo} - Sala {sessao.sala?.nome} - {new Date(sessao.horario).toLocaleTimeString('pt-BR')}
                </option>
              ))}
            </select>
            
            <Input label="Nome do Cliente" name="nomeCliente" value={novoIngresso.nomeCliente} onChange={handleChange}/>

            <div className="assento-selector">
              <label className="form-label">Assento</label>
              <div className="assento-display">
                {novoIngresso.assento || 'Nenhum assento selecionado'}
              </div>
              <Button type="button" onClick={() => setIsModalOpen(true)} disabled={!novoIngresso.sessaoId}>
                Selecionar Assento
              </Button>
            </div>
            
            <label className="form-label" htmlFor="tipo">Tipo de Ingresso</label>
            <select id="tipo" name="tipo" value={novoIngresso.tipo} onChange={handleChange} className="form-control">
              <option value="INTEIRA">Inteira</option>
              <option value="MEIA">Meia</option>
            </select>

            <div className="text-end mt-4">
              <Button type="submit" variant="success">Comprar</Button>
            </div>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h3>Ingressos Comprados:</h3>
            {listaIngressos.length === 0 ? (<p>Nenhum ingresso comprado ainda.</p>) : (
              <ul>
                {listaIngressos.map((ingresso) => (
                  <li key={ingresso.id}>
                    <strong>{ingresso.nomeCliente}</strong> - {ingresso.sessao?.filme?.titulo} (Assento: {ingresso.assento})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}