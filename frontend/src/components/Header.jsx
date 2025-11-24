import { useLocation } from 'react-router-dom';

//Imports dos ícones...
import UserIcon from "./icons/UserIcon";

export function Header({}) {
  const location = useLocation();

  const pageTitles = {
    '/': 'Dashboard - Visão Geral',
    '/agendas': 'Agendas e Atendimentos',
    '/leitos': 'Gestão de Leitos e Salas',
    '/turnos': 'Escala de Turnos',
    '/prontuarios': 'Consulta de Prontuários',
    '/exames': 'Status de Exames',
    '/transferencias': 'Controle de Transferências'
  };

  const currentTitle = pageTitles[location.pathname] || 'Gestão UPA';

  return (
    <header className="h-20 bg-LightGrey border-b border-Grey flex items-center justify-between px-8 shrink-0">
      
      <h1 className="text-3xl font-bold text-Black">
        {currentTitle}
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-base font-bold text-Black">Ricardo Almeida</p>
          <p className="text-sm text-Black">Gestor de Plantão</p>
        </div>
        
        <div className="w-12 h-12 bg-Grey p-2 rounded-full flex items-center justify-center text-Black">
          <UserIcon />
        </div>
      </div>

    </header>
  );
}