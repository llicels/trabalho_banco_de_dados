import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';

// Imports dos ícones...
import HomeIcon from "../icons/navbar/HomeIcon";
import CalendarIcon from "../icons/navbar/CalendarIcon";
import BedIcon from "../icons/navbar/BedIcon";
import ScheduleIcon from "../icons/navbar/ScheduleIcon";
import RecordsIcon from "../icons/navbar/RecordsIcon";
import ExamsIcon from "../icons/navbar/ExamsIcon";
import TransfersIcon from "../icons/navbar/TransfersIcon";
import MenuIcon from "../icons/navbar/MenuIcon";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", path: "/" },
    { icon: CalendarIcon, label: "Calendarário", path: "/agendas" },
    { icon: BedIcon, label: "Leitos", path: "/leitos" },
    { icon: ScheduleIcon, label: "Turnos", path: "/turnos" },
    { icon: RecordsIcon, label: "Prontuários", path: "/prontuarios" },
    { icon: ExamsIcon, label: "Exames", path: "/exames" },
    { icon: TransfersIcon, label: "Transferências", path: "/transferencias" },
  ];

  return (
    <aside className="h-screen w-20 bg-Blue1 flex flex-col items-center py-3 gap-12">
      
      <SidebarItem 
        icon={MenuIcon} 
        isActive={false} 
        onClick={() => console.log("Menu clicado!")} 
        iconClassName='w-8 h-8'
      />

      <nav className="flex flex-col gap-4 w-full px-3">
        {menuItems.map((item, index) => (
          <SidebarItem 
            key={index}
            icon={item.icon}
            
            isActive={location.pathname === item.path}
            
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

    </aside>
  );
}