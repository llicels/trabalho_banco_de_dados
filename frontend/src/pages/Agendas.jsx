import { useState } from "react";
import CalendarioDeConflitos from "../components/agendas/CalendarioDeConflitos";

// Função para formatar o número do dia para 'dd/mm'
function formatDay(day, month) {
  const monthStr = String(month + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${dayStr}/${monthStr}`;
}

export function Agendas() {
  // -----------------------------
  // MOCK DE EVENTOS
  // -----------------------------
  const mockEventos = [
    // Conflito REAL A: Mesmo dia (3), mesma sala (Sala 3), mesmo horário (10h–11h)
    { id: 1, day: 3, sala: "Sala 3", desc: "Dr. Silva e Dr. Santos", hora: "10h–11h" },
    { id: 5, day: 3, sala: "Sala 3", desc: "Reunião de Equipe", hora: "10h–11h" }, // <-- CONFLITO!
    
    // Conflito REAL B: Outro conflito para testar o agrupamento
    { id: 6, day: 15, sala: "Sala 1", desc: "Consulta Dra. Ana", hora: "09h–10h" },
    { id: 7, day: 15, sala: "Sala 1", desc: "Exame de Rotina", hora: "09h–10h" }, // <-- CONFLITO!
    
    // NÃO é Conflito (Sala diferente)
    { id: 2, day: 3, sala: "Sala 1", desc: "Dra. Maria e Dra. Ana", hora: "14h–15h" }, 
    
    // Evento único
    { id: 4, day: 20, sala: "Sala 2", desc: "Reunião de Projetos", hora: "16h–17h" },
  ];

  // -----------------------------
  // ESTADO DO CALENDÁRIO & POPUP
  // -----------------------------
  const [currentMonth, setCurrentMonth] = useState(10); 
  const [currentYear, setCurrentYear] = useState(2025);
  // Armazena o grupo de eventos conflitantes (o objeto completo do alerta)
  const [activeConflictAlert, setActiveConflictAlert] = useState(null); 

  const date = new Date(currentYear, currentMonth, 1);
  const firstWeekday = date.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


  // -----------------------------
  // FUNÇÃO DE IDENTIFICAÇÃO DE CONFLITOS REAIS
  // -----------------------------
  const findTrueConflicts = (events) => {
    const eventMap = new Map();
    const trueConflicts = [];

    // 1. Agrupar eventos por CHAVE ÚNICA (dia-sala-hora)
    events.forEach(event => {
      const key = `${event.day}-${event.sala}-${event.hora}`;
      if (!eventMap.has(key)) {
        eventMap.set(key, []);
      }
      eventMap.get(key).push(event);
    });

    // 2. Criar alertas de conflito a partir dos grupos com mais de 1 evento
    eventMap.forEach((eventList, key) => {
      if (eventList.length > 1) {
        // Criamos um objeto de ALERTA único por conflito
        const firstEvent = eventList[0];
        trueConflicts.push({
          key: key, // Chave única
          day: firstEvent.day,
          sala: firstEvent.sala,
          hora: firstEvent.hora,
          date: formatDay(firstEvent.day, currentMonth),
          events: eventList, // Lista de TODOS os eventos envolvidos
          count: eventList.length,
        });
      }
    });
                                
    return trueConflicts.sort((a, b) => a.day - b.day);
  };
  
  // Lista de ALERTA DE CONFLITOS REAIS 
  const conflictAlerts = findTrueConflicts(mockEventos);

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
    setActiveConflictAlert(null); // Fecha o pop-up ao mudar o mês
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
    setActiveConflictAlert(null); // Fecha o pop-up ao mudar o mês
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
      {/* TÍTULO DA PÁGINA */}
      <h1 className="text-2xl font-semibold mb-4">Agendas e Atendimentos</h1>

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