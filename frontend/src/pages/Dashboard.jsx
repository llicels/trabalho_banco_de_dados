import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/dashboard/StatCard';
import { SearchBar } from '../components/SearchBar';
import { BedOccupancyCard } from '../components/dashboard/BedOccupancyCard';
import { PendingExamsCard } from '../components/dashboard/PendingExamsCard';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 pt-4 bg-LightGrey min-h-full">
      
      {/* Barra de Busca */}
      <SearchBar 
        placeholder="Buscar paciente por nome ou CPF..." 
        className="mb-4" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* --- LINHA 1 --- */}
        <div className="lg:col-span-4">
          <StatCard 
            title="Conflitos de Agenda"
            value="2"
            label="Conflitos Hoje"
            isAlert={true} 
            onClick={() => navigate('/agendas')}
            footerContent={
              <div className="text-sm text-DarkGrey">
                <p className="text-base text-Black font-bold mb-1">Salas Afetadas:</p>
                <p className="text-DarkGrey">Consultório 03, Sala de Gesso</p>
              </div>
            }
          />
        </div>

        <div className="lg:col-span-4">
          <StatCard 
            title="Equipe em Plantão"
            value="45"
            label="Colaboradores Ativos"
            onClick={() => navigate('/turnos')}
            footerContent={
              <div className="text-base flex justify-center gap-8 text-center">
                <div>
                  <div className="font-bold text-Black">8</div>
                  <div className="text-sm text-DarkGrey">Médicos</div>
                </div>
                <div>
                  <div className="font-bold text-Black">32</div>
                  <div className="text-sm text-DarkGrey">Enfermagem</div>
                </div>
                <div>
                  <div className="font-bold text-Black">5</div>
                  <div className="text-sm text-DarkGrey">Apoio</div>
                </div>
              </div>
            }
          />
        </div>

        <div className="lg:col-span-4">
          <StatCard 
            title="Transferências Ativas"
            value="12"
            label="Pacientes em Processo"
            onClick={() => navigate('/transferencias')}
            footerContent={
              <div className="text-base flex justify-center gap-8 text-center">
                <div>
                  <div className="font-bold text-Black">8</div>
                  <div className="text-sm text-DarkGrey">Aguardando Ambulância</div>
                </div>
              </div>
            }
          />
        </div>

        {/* --- LINHA 2 --- */}
        <div className="lg:col-span-8 w-full h-108">
           <BedOccupancyCard onClick={() => navigate('/leitos')}/>
        </div>

        <div className="lg:col-span-4 w-full h-108">
           <PendingExamsCard onClick={() => navigate('/exames')}/>
        </div>

      </div>
    </div>
  );
}