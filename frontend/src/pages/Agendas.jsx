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
  // MOCK DE EVENTOS (não conflitos, mas todos os agendamentos)(Só para o teste, sem implementar o banco de dados ainda)
  // -----------------------------
  const mockEventos = [
    // Conflito REAL: Mesmo dia (3), mesma sala (Sala 3), mesmo horário (10h–11h)
    { id: 1, day: 3, sala: "Sala 3", desc: "Dr. Silva e Dr. Santos", hora: "10h–11h" },
    { id: 5, day: 3, sala: "Sala 3", desc: "Reunião de Equipe", hora: "10h–11h" }, // <-- CONFLITO!
    
    // NÃO é Conflito (Sala diferente): Dia 3, Horário diferente (14h-15h)
    { id: 2, day: 3, sala: "Sala 1", desc: "Dra. Maria e Dra. Ana", hora: "14h–15h" }, 
    
    // NÃO é Conflito (Dia diferente)
    { id: 3, day: 7, sala: "Sala 3", desc: "Dr. Silva e Dr. Santos", hora: "10h–11h" },
    
    // Evento único
    { id: 4, day: 20, sala: "Sala 2", desc: "Reunião de Projetos", hora: "16h–17h" },
  ];

  // -----------------------------
  // ESTADO DO CALENDÁRIO
  // -----------------------------
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = Novembro
  const [currentYear, setCurrentYear] = useState(2025);

  const date = new Date(currentYear, currentMonth, 1);
  const firstWeekday = date.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // -----------------------------
  // FUNÇÃO DE IDENTIFICAÇÃO DE CONFLITOS REAIS
  // -----------------------------
  const findTrueConflicts = (events) => {
    const conflicts = [];
    const eventMap = new Map();

    // Cria uma chave única para a combinação de dia, sala e hora
    events.forEach(event => {
      const key = `${event.day}-${event.sala}-${event.hora}`;
      
      if (!eventMap.has(key)) {
        eventMap.set(key, []);
      }
      eventMap.get(key).push(event);
    });

    // Filtra apenas as chaves que têm 2 ou mais eventos
    eventMap.forEach(eventList => {
      if (eventList.length > 1) {
        // Adiciona todos os eventos conflitantes à lista de conflitos
        eventList.forEach(event => {
            if (!conflicts.some(c => c.id === event.id)) {
                // Adiciona a data formatada e o grupo de conflito
                conflicts.push({
                    ...event,
                    date: formatDay(event.day, currentMonth),
                    isConflict: true
                });
            }
        });
      }
    });
    
    // Garante que a lista de conflitos seja única por ID, e ordenada por dia
    const uniqueConflicts = Array.from(new Set(conflicts.map(c => c.id)))
                                .map(id => conflicts.find(c => c.id === id))
                                .sort((a, b) => a.day - b.day);
                                
    return uniqueConflicts;
  };
  
  // Lista de conflitos REAIS a ser usada na renderização
  const trueConflicts = findTrueConflicts(mockEventos);

  // -----------------------------
  // GERA MATRIZ DO CALENDÁRIO
  // -----------------------------
  const weeks = [];
  let dayCounter = 1;

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
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };

  // -----------------------------
  // FUNÇÃO PARA SCROLL PARA UM DIA
  // -----------------------------
  const scrollToDay = (day) => {
    const el = document.getElementById(`day-${day}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="p-6">
      {/* TÍTULO DA PÁGINA */}
      <h1 className="text-2xl font-semibold mb-4">Agendas e Atendimentos</h1>

      {/* -------------------------
          BARRA DE ALERTAS / CONFLITOS
      -------------------------- */}
      <div className="bg-red-200 border border-red-300 text-red-800 p-4 rounded-xl mb-6">
        <p className="font-medium mb-3 flex items-center gap-2">
          <span>⚠</span> Conflitos Identificados ({trueConflicts.length})
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/*Iterando apenas sobre os trueConflicts */}
          {trueConflicts.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollToDay(c.day)}
              className="bg-white p-3 rounded-lg shadow-sm border hover:bg-red-50 transition flex flex-col items-start"
            >
                <span className="text-xs font-normal text-red-500 mb-1">
                    {c.date} | {c.hora}
                </span>
                <span className="text-sm font-medium text-gray-800">
                    {c.sala} – {c.desc}
                </span>
            </button>
          ))}
          {trueConflicts.length === 0 && (
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
        mockConflitos={trueConflicts} // Passando os conflitos REAIS
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        date={date}
      />
    </div>
  );
}