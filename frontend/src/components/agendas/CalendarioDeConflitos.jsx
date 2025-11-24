export default function CalendarioDeConflitos({
  weeks,
  currentYear,
  conflictAlerts,
  nextMonth,
  prevMonth,
  date,
  // Props de estado e manipulação do Pop-up
  activeConflictAlert, 
  setActiveConflictAlert,
  handleConflictClick,
}) {
  
  // Encontra o objeto de Alerta de Conflito para um dia específico
  function getConflictAlertForDay(day) {
    if (!day) return null;
    // Retorna o objeto de alerta (que contém a lista de eventos conflitantes)
    return conflictAlerts.find((c) => c.day === day);
  }

  const monthName = date.toLocaleString("pt-BR", { month: "long" });

  return (
    <div className="p-4"> 
    
      {/* Cabeçalho do mês e Navegação */}
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

      {/* Cabeçalho semanal */}
      <div className="grid grid-cols-7 text-center text-gray-700 font-medium mb-1">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      {/* DIAS */}
      <div 
        className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden" 
        style={{ borderWidth: '1px' }}
      >
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const conflictAlert = getConflictAlertForDay(day); 

            return (
              <div
                key={`${wi}-${di}`}
                id={day ? `day-${day}` : undefined}
                className={`
                  h-24 p-2 relative 
                  // CLASSE PARA DIVISORES INTERNOS (Bordas L e T)
                  border-l border-t border-gray-300
                  flex flex-col text-sm
                  // Fundo transparente para dias vazios (bg-transparent) e fundo branco para dias preenchidos
                  ${day ? "text-gray-900 bg-white hover:bg-gray-50" : "bg-transparent"} 
                  transition
                  
                  // REMOVENDO BORDAS DA PRIMEIRA COLUNA E PRIMEIRA LINHA PARA EFEITO DE GRID
                  ${di === 0 ? 'border-l-0' : ''} 
                  ${wi === 0 ? 'border-t-0' : ''} 
                `}
              >
                {/* número do dia */}
                <span className={`text-xs font-normal ${day ? 'opacity-70' : ''}`}>
                    {day || ""}
                </span>

                {/* Marcador de Conflito */}
                {conflictAlert && (
                  <button
                    // Chama a função combinada para abrir o popup E rolar para o dia
                    onClick={() => handleConflictClick(conflictAlert)} 
                    className="mt-auto bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full hover:bg-red-200 transition"
                  >
                    {conflictAlert.count} conflito(s)
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* POPUP DE DETALHES DO CONFLITO */}
      {activeConflictAlert && ( 
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            
            <h2 className="text-xl font-bold text-red-700 mb-2">
                Conflito: {activeConflictAlert.sala}
            </h2>
            
            <p className="text-gray-700 mb-4 font-bold">
              Data: {activeConflictAlert.date} | Horário: {activeConflictAlert.hora}
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">
              Eventos Conflitantes ({activeConflictAlert.count})
            </h3>
            
            {/* Iterando sobre os eventos conflitantes */}
            {activeConflictAlert.events.map((event, index) => (
                <div key={event.id} className={`p-3 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} mb-2`}>
                    <p className="text-sm font-medium text-gray-900">
                        {event.desc}
                    </p>
                    <p className="text-xs text-gray-500">
                        ID do Agendamento: {event.id}
                    </p>
                </div>
            ))}

            <button
              onClick={() => setActiveConflictAlert(null)}
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}