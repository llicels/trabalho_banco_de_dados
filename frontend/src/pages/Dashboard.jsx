import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';

// Imports de componentes...
import { StatCard } from '../components/dashboard/StatCard';
import { SearchBar } from '../components/SearchBar';
import { BedOccupancyCard } from '../components/dashboard/BedOccupancyCard';
import { PendingExamsCard } from '../components/dashboard/PendingExamsCard';

export function Dashboard() {
  const navigate = useNavigate();

  const handleBuscaGlobal = (termo) => {
    if (termo.trim()) {
      navigate(`/prontuarios?busca=${encodeURIComponent(termo)}`);
    }
  };

  const [leitos, setLeitos] = useState({ total: 40, ocupados: 0, detalhes: { capEmergencia: 0, capObservacao: 0, ocupadosEmergencia: 0, ocupadosObservacao: 0, manutencao: 0 }});
  const [equipe, setEquipe] = useState({ total: 0, medicos: 0, enfermagem: 0, apoio: 0 });
  const [transferencias, setTransferencias] = useState(0);
  const [conflitos, setConflitos] = useState({ total: 0, salas: [] });
  const [exames, setExames] = useState({ atrasados: 0, aguardando: 0, lista: [] });
  
  useEffect(() => {
    async function carregarDados() {
      const dadosLeitos = await dashboardService.getDadosLeitos();
      const dadosEquipe = await dashboardService.getEquipePlantao();
      const dadosTransf = await dashboardService.getTransferenciasAtivas();
      const dadosConflitos = await dashboardService.getConflitosAgenda();
      const dadosExames = await dashboardService.getExamesPendentes();

      setLeitos(dadosLeitos);
      setEquipe(dadosEquipe);
      setTransferencias(dadosTransf);
      setConflitos(dadosConflitos);
      setExames(dadosExames);
    }

    carregarDados();
  }, []);

  return (
    <div className="p-8 pt-4 bg-LightGrey min-h-full">
      
      <SearchBar 
        placeholder="Buscar paciente por nome ou CPF..." 
        className="mb-4" 
        onSubmit={handleBuscaGlobal} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LINHA 1 */}
       <div className="lg:col-span-4">
          <StatCard 
            title="Conflitos de Agenda"
            value={conflitos.total} 
            label={conflitos.total > 0 ? "Conflitos Hoje" : "Agenda em dia"}
            
            // Só fica vermelho se tiver conflito
            isAlert={conflitos.total > 0} 
            
            onClick={() => navigate('/agendas')}
            footerContent={
              <div className="text-sm text-DarkGrey">
                {conflitos.total > 0 ? (
                  <>
                    <p className="text-base text-Black font-bold mb-1">Salas Afetadas:</p>
                    <p className="text-DarkGrey">
                      {conflitos.salas.length > 0 ? conflitos.salas.join(", ") : "Verificar Agenda"}
                    </p>
                  </>
                ) : (
                  <p className="text-green-600 font-medium mt-2">
                    Nenhuma sobreposição detectada.
                  </p>
                )}
              </div>
            }
          />
        </div>

        <div className="lg:col-span-4">
          <StatCard 
            title="Equipe em Plantão"
            value={equipe.total} // DADO DA API
            label="Colaboradores Ativos"
            onClick={() => navigate('/turnos')}
            footerContent={
              <div className="text-base flex justify-center gap-8 text-center">
                <div><div className="font-bold text-Black">{equipe.medicos}</div><div className="text-sm text-DarkGrey">Médicos</div></div>
                <div><div className="font-bold text-Black">{equipe.enfermagem}</div><div className="text-sm text-DarkGrey">Enfermagem</div></div>
                <div><div className="font-bold text-Black">{equipe.apoio}</div><div className="text-sm text-DarkGrey">Apoio</div></div>
              </div>
            }
          />
        </div>

        <div className="lg:col-span-4">
          <StatCard 
            title="Transferências Ativas"
            value={transferencias} // DADO DA API
            label="Pacientes em Processo"
            onClick={() => navigate('/transferencias')}
            footerContent={
              <div className="text-base flex justify-center gap-8 text-center">
                <div><div className="font-bold text-Black">{transferencias}</div><div className="text-sm text-DarkGrey">Aguardando Ambulância</div></div>
              </div>
            }
          />
        </div>

        {/* LINHA 2 */}
        <div className="lg:col-span-8 w-full h-96">
           <BedOccupancyCard 
              onClick={() => navigate('/leitos')}
              total={leitos.total}
              ocupados={leitos.ocupados}
              detalhes={leitos.detalhes} 
           />
        </div>

        <div className="lg:col-span-4 w-full h-96">
           {/* Exames ainda fixo pois falta rota global no backend */}
           <PendingExamsCard 
              onClick={() => navigate('/exames')}
              atrasados={exames.atrasados}
              aguardando={exames.aguardando}
              listaExames={exames.lista}
           />
        </div>

      </div>
    </div>
  );
}