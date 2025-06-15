import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import Filme from './pages/Filme/Filme';
import Sala from './pages/Sala/Sala';
import Sessao from './pages/Sessao/Sessao';
import Ingressos from './pages/Ingressos/Ingressos';

export default function App() {
  return (
    <Router>
      <Menu />
      <div className="container mt-4">
        <Routes>
          <Route path="/filme" element={<Filme />} />
          <Route path="/sala" element={<Sala />} />
          <Route path="/sessao" element={<Sessao />} />
          <Route path="/ingressos" element={<Ingressos />} />
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
