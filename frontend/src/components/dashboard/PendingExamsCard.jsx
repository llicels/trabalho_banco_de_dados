export function PendingExamsCard({ onClick }) {
  return (
    <div 
      onClick={onClick}
      // Adicionei cursor-pointer e hover
      className="bg-PureWhite p-6 rounded-2xl shadow-sm border border-LightGrey flex flex-col w-full h-full overflow-hidden cursor-pointer hover:border-Blue1 transition-colors"
    >

      <div className="flex items-center gap-2 text-Black font-bold mb-6 text-lg shrink-0">
        <span>Exames Pendentes</span>
      </div>
      
      {/* 3. AQUI: Adicionei 'shrink-0' para os números nunca encolherem */}
      <div className="flex justify-around mb-6 text-center shrink-0">
        <div>
          <div className="text-4xl font-bold text-Red">4</div>
          <div className="text-Red font-bold text-base">Atrasados</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-Black">12</div>
          <div className="text-Black font-bold text-base">Aguardando</div>
        </div>
      </div>

      {/* 4. A LISTA: Removemos o min-h-0 que estava bugando */}
      {/* O flex-1 agora vai ocupar o espaço restante e o overflow vai ativar o scroll */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          2 Hemogramas
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          1 Raio-X
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          2 Hemogramas
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          1 Raio-X
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          3 Tomografias
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          1 Ressonância
        </div>
        <div className="px-4 py-3 rounded-full bg-LightGrey text-sm text-Black">
          2 Hemogramas
        </div>
      </div>
    </div>
  );
}