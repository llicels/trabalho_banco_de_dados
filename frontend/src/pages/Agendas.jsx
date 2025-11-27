import { useEffect, useState } from "react";
import CalendarioDeConflitos from "../components/agendas/CalendarioDeConflitos";
import { agendaService } from "../services/api";

export function Agendas() {
  // -----------------------------
  const [conflictAlerts, setConflictAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentMonth, setCurrentMonth] = useState(10); 
  const [currentYear, setCurrentYear] = useState(2025);
  // Armazena o grupo de eventos conflitantes (o objeto completo do alerta)
  const [activeConflictAlert, setActiveConflictAlert] = useState(null); 

  const date = new Date(currentYear, currentMonth, 1);
  const firstWeekday = date.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setLoading(true);
      setError('');
      try {
        const { conflicts } = await agendaService.getEventosDoMes(currentYear, currentMonth);
        if (!ativo) return;
        setConflictAlerts(conflicts);
      } catch (err) {
        console.error('Erro ao carregar agenda', err);
        if (ativo) setError('Não foi possível carregar os agendamentos.');
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [currentMonth, currentYear]);

  // -----------------------------
  // GERA MATRIZ DO CALENDÁRIO
  // -----------------------------
  const weeks = [];
  let dayCounter = 1;
  // ... (lógica de weeks, firstWeekday, daysInMonth) ...

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstWeekday) || dayCounter > daysInMonth) {
        week.push(null);
      } else {
        week.push(dayCounter);
        dayCounter++;
      }
    }
    weeks.push(week);
  }

  // -----------------------------
  // NAVEGAÇÃO ENTRE MESES 
  // -----------------------------
  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
    setActiveConflictAlert(null);
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
    setActiveConflictAlert(null);
  };

  // -----------------------------
  // FUNÇÕES DE AÇÃO
  // -----------------------------
  const scrollToDay = (day) => {
    const el = document.getElementById(`day-${day}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  
  const handleConflictClick = (conflictAlert) => {
    setActiveConflictAlert(conflictAlert); // Abre o pop-up
    scrollToDay(conflictAlert.day);      // Rola para o dia
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg text-gray-500 shadow-sm">
          Carregando agenda...
        </div>
      )}
      
      {/* -------------------------
          BARRA DE ALERTAS / CONFLITOS
      -------------------------- */}
      <div className="bg-red-200 border border-red-300 text-red-800 p-4 rounded-xl mb-6">
        <p className="font-medium mb-3 flex items-center gap-2">
          <span>⚠</span> Conflitos Identificados ({conflictAlerts.length})
        </p>

        <div className="grid grid-cols-3 gap-3">
          {conflictAlerts.map((alert) => (
            <button
              key={alert.key}
              // Chama a função combinada
              onClick={() => handleConflictClick(alert)}
              className="bg-white p-3 rounded-lg shadow-sm border hover:bg-red-50 transition flex flex-col items-start"
            >
                <span className="text-xs font-normal text-red-500 mb-1">
                    {alert.date} | {alert.hora} | {alert.count} eventos
                </span>
                <span className="text-sm font-medium text-gray-800">
                    {alert.sala}
                </span>
            </button>
          ))}
          {conflictAlerts.length === 0 && (
            <p className="text-red-700 col-span-3">Nenhum conflito encontrado para este mês.</p>
          )}
        </div>
      </div>

      {/* -------------------------
          CALENDÁRIO (Componente)
      -------------------------- */}
      <CalendarioDeConflitos
        weeks={weeks}
        currentMonth={currentMonth}
        currentYear={currentYear}
        conflictAlerts={conflictAlerts} // Passando os alertas agrupados
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        date={date}
        
        // PASSANDO O ESTADO E FUNÇÕES DO POPUP PARA O COMPONENTE
        activeConflictAlert={activeConflictAlert} 
        setActiveConflictAlert={setActiveConflictAlert}
        handleConflictClick={handleConflictClick}
      />
    </div>
  );
}