import { useState } from "react";

export default function CalendarioDeConflitos({
  weeks,
  currentYear,
  mockConflitos,
  nextMonth,
  prevMonth,
  date,
}) {
  const [selectedConflict, setSelectedConflict] = useState(null);

  function getConflictsForDay(day) {
    if (!day) return [];
    return mockConflitos.filter((c) => c.day === day);
  }

  const monthName = date.toLocaleString("pt-BR", { month: "long" });

  return (
    <div className="p-4"> 
      
      {/* Cabeçalho do mês*/}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-black text-xl"
        >
          &lt;
        </button>

        <h2 className="text-lg font-semibold capitalize">
          {monthName} {currentYear}
        </h2>

        <button
          onClick={nextMonth}
          className="text-gray-600 hover:text-black text-xl"
        >
          &gt;
        </button>
      </div>

      {/* Cabeçalho semanal (Dom, Seg, Ter...)*/}
      <div className="grid grid-cols-7 text-center text-gray-700 font-medium mb-1">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      {/* DIAS - Corpo do Calendário */}
      <div 
        className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden" 
        style={{ borderWidth: '1px' }} // Garante uma borda fina externa
      >
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const conflicts = getConflictsForDay(day);

            return (
              <div
                key={`${wi}-${di}`}
                id={day ? `day-${day}` : undefined}
                className={`
                  h-24 p-2 relative 
                  // CLASSE PARA DIVISORES INTERNOS (Bordas L e T)
                  border-l border-t border-gray-300
                  flex flex-col text-sm
                  // 💡 ALTERAÇÃO 2: Dias do mês atual têm bg-white. Dias vazios (null) têm bg-transparent.
                  ${day ? "text-gray-900 bg-white hover:bg-gray-50" : "bg-transparent"} 
                  transition
                  
                  // REMOVENDO BORDAS DA PRIMEIRA COLUNA E PRIMEIRA LINHA PARA EFEITO DE GRID
                  ${di === 0 ? 'border-l-0' : ''} // Remove borda L da primeira coluna
                  ${wi === 0 ? 'border-t-0' : ''} // Remove borda T da primeira linha
                `}
              >
                {/* número do dia */}
                <span className={`text-xs font-normal ${day ? 'opacity-70' : ''}`}>
                    {day || ""}
                </span>

                {/* Marcador de Conflito */}
                {conflicts.length > 0 && (
                  <button
                    onClick={() => setSelectedConflict(conflicts[0])}
                    className="mt-auto bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full hover:bg-red-200 transition"
                  >
                    {conflicts.length} conflito(s)
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* POPUP DE DETALHES DO CONFLITO */}
      {selectedConflict && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {/* EXIBINDO A DATA COMPLETA */}
                Conflito em {selectedConflict.date}
            </h2>

            <p className="text-gray-600 mb-1">
              **Horário:** {selectedConflict.hora}
            </p>
            <p className="text-gray-600 mb-1">
              **Local:** {selectedConflict.sala}
            </p>
            <p className="text-gray-600 mb-4">
              **Descrição:** {selectedConflict.desc}
            </p>

            <button
              onClick={() => setSelectedConflict(null)}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}