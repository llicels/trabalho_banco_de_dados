export function BedOccupancyCard({ 
  total = 40, 
  ocupados = 0, 
  detalhes = {},
  onClick 
}) {
  
  // 1. Extração Segura dos Dados
  const capEmergencia = detalhes?.capEmergencia || 10;
  const capObservacao = detalhes?.capObservacao || 30;
  const ocupadosEmergencia = detalhes?.ocupadosEmergencia || 0;
  const ocupadosObservacao = detalhes?.ocupadosObservacao || 0;
  const manutencao = detalhes?.manutencao || 0;

  // 2. Cálculos Matemáticos (Protegidos contra divisão por zero)
  const safeTotal = total > 0 ? total : 1;
  const safeCapEmergencia = capEmergencia > 0 ? capEmergencia : 1;
  const safeCapObservacao = capObservacao > 0 ? capObservacao : 1;

  const percentualGeral = Math.round((ocupados / safeTotal) * 100);
  const pctEmergencia = Math.round((ocupadosEmergencia / safeCapEmergencia) * 100);
  const pctObservacao = Math.round((ocupadosObservacao / safeCapObservacao) * 100);
  
  // Cálculo de livres
  const livres = Math.max(0, total - ocupados - manutencao);

  // 3. Estilo do Gráfico
  const styleGrafico = {
    background: `conic-gradient(#1E3A8A 0% ${percentualGeral}%, #F3F4F6 ${percentualGeral}% 100%)`
  };

  return (
    <div 
      onClick={onClick}
      className="bg-PureWhite p-6 rounded-2xl shadow-sm border border-LightGrey w-full h-full min-h-[320px] flex flex-col cursor-pointer hover:border-Blue1 transition-colors"
    >
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg text-Black font-bold">Ocupação de Leitos</h3>
        <span className="text-sm text-DarkGrey bg-LightGrey px-3 py-1 rounded-full">
          Capacidade Total: {total}
        </span>
      </div>
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 h-full px-4">
        
        {/* GRÁFICO DONUT */}
        <div className="relative w-48 h-48 rounded-full flex items-center justify-center shrink-0 py-2"
             style={styleGrafico}>
          <div className="w-40 h-40 bg-PureWhite rounded-full flex flex-col items-center justify-center absolute shadow-inner">
            <span className="text-5xl font-bold text-Black">{percentualGeral}%</span>
            <span className="text-sm font-medium text-DarkGrey mt-1">
              {ocupados} de {total} ocupados
            </span>
          </div>
        </div>

        {/* GRID DE INFORMAÇÕES */}
        <div className="flex-1 w-full grid grid-cols-1 gap-6">
          
          {/* 1. Emergência */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-sm text-DarkGrey font-medium">Emergência (Sala Vermelha)</span>
                <span className="text-xl font-bold text-Black">
                  {ocupadosEmergencia} <span className="text-sm text-DarkGrey font-normal">/ {capEmergencia} ocupados</span>
                </span>
              </div>
              <span className="text-Blue3 font-bold bg-Blue3/10 px-2 py-1 rounded text-xs">
                {pctEmergencia}%
              </span>
            </div>
            
            <div className="w-full bg-LightGrey rounded-full h-3 overflow-hidden">
              <div className="bg-Blue3 h-full rounded-full transition-all duration-1000" style={{ width: `${pctEmergencia}%` }}></div>
            </div>
          </div>

          {/* 2. Observação */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-sm text-DarkGrey font-medium">Observação (Ala Geral)</span>
                <span className="text-xl font-bold text-Black">
                  {ocupadosObservacao} <span className="text-sm text-DarkGrey font-normal">/ {capObservacao} ocupados</span>
                </span>
              </div>
              <span className="text-Blue1 font-bold bg-Blue1/10 px-2 py-1 rounded text-xs">
                {pctObservacao}%
              </span>
            </div>
            
            <div className="w-full bg-LightGrey rounded-full h-3 overflow-hidden">
              <div className="bg-Blue1 h-full rounded-full transition-all duration-1000" style={{ width: `${pctObservacao}%` }}></div>
            </div>
            <p className="text-xs text-DarkGrey mt-1 text-right">{livres} leitos livres totais</p>
          </div>

          {/* 3. Manutenção */}
          <div className="flex items-center gap-3 pt-4 border-t border-LightGrey mt-2">
            <div className="w-10 h-10 p-2 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
               {/* Ícone SVG Vassoura */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="w-6 h-6">
                 <path d="M247.31,124.76c-5.83-8.76-26.66-22.31-57.67-16.66a102.12,102.12,0,0,0-30.19,11l-77-77a22,22,0,0,0-31.11,0l-8.49,8.49a22,22,0,0,0,0,31.11l30.27,30.27-62.7,62.7a14,14,0,0,0,0,19.8l25.45,25.46a14,14,0,0,0,19.8,0l62.7-62.7,30.27,30.27a22,22,0,0,0,31.11,0l8.49-8.49a22,22,0,0,0,0-31.11l77,77A98.59,98.59,0,0,0,220,192a102.34,102.34,0,0,0,18.64-1.72C253.71,186.73,256,155.52,256,136A8,8,0,0,0,247.31,124.76Z"/>
               </svg>
            </div>
            <div>
              <span className="block text-sm text-DarkGrey">Manutenção / Limpeza</span>
              <span className="block text-lg font-bold text-Black">{manutencao} Leitos Bloqueados</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}