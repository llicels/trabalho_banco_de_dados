import React, { useState } from 'react';

// Dados mockados para simular a busca de novos colaboradores
const mockAllColaboradores = [
    { id: 201, nome: "Dr. Marcelo Alves", crm: "50515253545", funcao: "Médico Clínico" },
    { id: 202, nome: "Enf. Roberta Silva", crm: "40414243444", funcao: "Enfermeira" },
    { id: 203, nome: "Tec. Paulo Costa", crm: "30313233343", funcao: "Técnico de Enfermagem" },
];

// Card de exibição de um colaborador dentro do modal
const ColaboradorCard = ({ nome, documento, funcao, onAction, actionText }) => (
  <div className="flex justify-between items-center p-3 my-2 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
    <span className="font-semibold text-gray-800">{nome}</span>
    <div className="text-sm text-gray-600 flex gap-4 items-center">
      <span>ID: {documento || '—'}</span>
      <span>Função: {funcao}</span>
      {onAction && (
        <button 
            onClick={onAction}
            className="text-blue-600 hover:text-blue-800 font-medium ml-4 transition"
        >
            {actionText}
        </button>
      )}
    </div>
  </div>
);

// Componente principal do Modal
export function TurnosEscalasModal({ data, onClose }) {
  const { setor, hora, status, colaboradores } = data;
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const titulo = status === 1 
    ? `Cobertura ${setor}` 
    : `Lacuna ${setor}`;
    
  const horaFormatada = `${hora}h – ${hora + 1}h`;

  // Simula a filtragem de colaboradores disponíveis
  const searchResults = searchTerm.length > 2 
    ? mockAllColaboradores.filter(colab => 
        colab.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        colab.crm.includes(searchTerm)
      ) 
    : [];
    
  const handleAddColaborador = (colab) => {
      alert(`Simulação: Adicionando ${colab.nome} à escala.`);
      setIsSearching(false);
      setSearchTerm('');
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Cabeçalho do Modal */}
        <div className={`p-4 text-white font-bold text-lg flex justify-between items-center ${status === 1 ? 'bg-blue-700' : 'bg-red-700'}`}>
          <span>{titulo}</span>
          <span>{horaFormatada}</span>
        </div>
        
        <div className="p-6">
          
          {/* 1. Lista de Colaboradores Escalados */}
          <h3 className="text-gray-700 font-semibold mb-3">Colaboradores Escalados</h3>
          
          {colaboradores.length > 0 ? (
            <div>
              {colaboradores.map((colab) => (
                <ColaboradorCard 
                    key={colab.id} 
                    nome={colab.nome} 
                    documento={colab.documento || colab.id} 
                    funcao={colab.funcao} 
                />
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-4 border border-red-300">
                <p className="font-medium">⚠️ Lacuna de Cobertura</p>
                <p className="text-sm">Nenhum colaborador escalado. Preencha a lacuna abaixo.</p>
            </div>
          )}

          {/* 2. ÁREA DE BUSCA DE NOVO COLABORADOR */}
          {!isSearching ? (
              <button 
                onClick={() => setIsSearching(true)}
                className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium transition py-2 px-3 rounded-lg border border-transparent hover:border-blue-200"
              >
                <span className="text-xl leading-none">+</span> Adicionar Colaborador
              </button>
          ) : (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Buscar Colaborador por Nome ou CPF</h4>
                  
                  {/* Campo de Busca */}
                  <div className="relative mb-3">
                      <input 
                          type="text" 
                          placeholder="Digite nome ou CPF..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 pl-8 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <svg className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                  </div>
                  
                  {/* Resultados da Busca */}
                  {searchTerm.length > 2 && searchResults.length > 0 && (
                      <div className="border-t pt-2">
                          {searchResults.map((colab) => (
                              <ColaboradorCard 
                                  key={colab.id} 
                                  nome={colab.nome} 
                              documento={colab.crm} 
                                  funcao={colab.funcao} 
                                  onAction={() => handleAddColaborador(colab)}
                                  actionText="ADICIONAR"
                              />
                          ))}
                      </div>
                  )}
                  {searchTerm.length > 2 && searchResults.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">Nenhum colaborador encontrado.</p>
                  )}

                  <button 
                      onClick={() => { setIsSearching(false); setSearchTerm(''); }}
                      className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition w-full text-center"
                  >
                      Cancelar Busca
                  </button>
              </div>
          )}

          {/* 3. Botão de Fechar */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}