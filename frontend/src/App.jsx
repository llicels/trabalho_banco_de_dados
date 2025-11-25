import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Imports dos Componentes
import { Sidebar } from './components/navbar/Sidebar';
import { Header } from './components/Header';

// Imports das Páginas
import { Dashboard } from './pages/Dashboard';
import { Agendas } from './pages/Agendas';
import { Leitos } from './pages/Leitos';
import { Turnos } from './pages/Turnos';
import { Prontuarios } from './pages/Prontuarios';
import { Exames } from './pages/Exames';
import { Transferencias } from './pages/Transferencias';


function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header title="Gestão UPA" />

          <div className="flex-1 overflow-auto">
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agendas" element={<Agendas />} />
              <Route path="/leitos" element={<Leitos />} />
              <Route path="/turnos" element={<Turnos />} />
              <Route path="/prontuarios" element={<Prontuarios />} />
              <Route path="/exames" element={<Exames />} />
              <Route path="/transferencias" element={<Transferencias />} />
            </Routes>

          </div>
        </main>
        
      </div>
    </BrowserRouter>
  )
}

export default App;