export function BedOccupancyCard({ onClick }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-PureWhite p-6 rounded-2xl shadow-sm border border-LightGrey w-full h-full min-h-[320px] flex flex-col cursor-pointer hover:border-Blue1 transition-colors"
    >

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg text-Black font-bold">Ocupação de Leitos</h3>
        <span className="text-sm text-DarkGrey bg-LightGrey px-3 py-1 rounded-full">
          Capacidade Total: 40
        </span>
      </div>
      
      {/* Aumentei o gap para gap-12 (48px) para dar mais respiro horizontal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 h-full px-4">
        
        {/* ESQUERDA: Gráfico */}
        {/* Adicionei py-2 para garantir margem vertical */}
        <div className="relative w-52 h-52 rounded-full flex items-center justify-center shrink-0 py-2"
             style={{ background: 'conic-gradient(#12284C 0% 55%, #F3F4F6 55% 100%)' }}>
          <div className="w-44 h-44 bg-PureWhite rounded-full flex flex-col items-center justify-center absolute shadow-inner">
            <span className="text-5xl font-bold text-Black">55%</span>
            <span className="text-base font-bold text-DarkGrey mt-1">Geral</span>
          </div>
        </div>

        {/* DIREITA: Grid de Informações */}
        <div className="flex-1 w-full grid grid-cols-1 gap-6">
          
          {/* Bloco Emergência */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-base text-DarkGrey font-bold">Emergência (Sala Vermelha)</span>
                <span className="text-xl font-bold text-Black">8 <span className="text-sm text-DarkGrey font-normal">/ 10 ocupados</span></span>
              </div>
              <span className="text-Blue3 font-bold bg-Blue1/10 px-2 py-1 rounded text-xs">80%</span>
            </div>
            <div className="w-full bg-LightGrey rounded-full h-4 overflow-hidden">
              <div className="bg-Blue5 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-DarkGrey mt-1 text-right">1 leito livre</p>
          </div>

          {/* Bloco Observação */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-base text-DarkGrey font-bold">Observação (Ala Geral)</span>
                <span className="text-xl font-bold text-Black">12 <span className="text-sm text-DarkGrey font-normal">/ 25 ocupados</span></span>
              </div>
              <span className="text-Blue3 font-bold bg-Blue1/10 px-2 py-1 rounded text-xs">48%</span>
            </div>
            <div className="w-full bg-LightGrey rounded-full h-4 overflow-hidden">
              <div className="bg-Blue5 h-full rounded-full" style={{ width: '48%' }}></div>
            </div>
            <p className="text-xs text-DarkGrey mt-1 text-right">13 leitos livres</p>
          </div>

          {/* Bloco Manutenção */}
          <div className="flex items-center gap-3 pt-4 border-t border-LightGrey mt-2">
            <div className="w-10 h-10 p-2 bg-LightYellow rounded-lg flex items-center justify-center">
               {/* Ícone vazio */}
            </div>
            <div>
              <span className="text-base text-DarkGrey font-bold mb-4">Manutenção / Limpeza</span>
              <span className="block text-lg font-bold text-Black">5 Leitos Bloqueados</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}