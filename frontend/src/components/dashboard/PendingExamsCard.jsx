export function PendingExamsCard({ 
  atrasados = 0, 
  aguardando = 0, 
  listaExames = [],
  onClick 
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-PureWhite p-6 rounded-2xl shadow-sm border border-LightGrey flex flex-col w-full h-full overflow-hidden cursor-pointer hover:border-Blue1 transition-colors"
    >
      
      {/* Título */}
      <div className="flex items-center gap-2 text-Black font-bold mb-6 text-lg shrink-0">
        <span>Exames Pendentes</span>
      </div>
      
      {/* Números de Resumo */}
      <div className="flex justify-around mb-6 text-center shrink-0">
        <div>
          <div className="text-4xl font-bold text-Red">{atrasados}</div>
          <div className="text-Red font-bold text-base">Atrasados</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-Black">{aguardando}</div>
          <div className="text-Black font-bold text-base">Aguardando</div>
        </div>
      </div>

      {/* LISTA DINÂMICA */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        
        {/* Se a lista estiver vazia, mostra aviso */}
        {listaExames.length === 0 ? (
          <p className="text-center text-Grey text-sm mt-4">Nenhum exame pendente</p>
        ) : (
          // Se tiver itens, faz o mapa
          listaExames.map((item, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-3 rounded-full bg-LightGrey text-sm">
              <span className="text-Black font-medium">{item.tipo}</span>
              
              {/* Badge condicional: Vermelho se atrasado, Cinza se aguardando */}
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                item.status === 'Atrasado' 
                  ? 'text-Red bg-white border-Red/20' 
                  : 'text-DarkGrey bg-white border-Grey/20'
              }`}>
                {item.status === 'Atrasado' ? `${item.tempo} Atraso` : 'Na fila'}
              </span>
            </div>
          ))
        )}

      </div>
    </div>
  );
}