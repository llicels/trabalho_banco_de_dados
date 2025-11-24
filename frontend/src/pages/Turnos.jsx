import React, { useState, useMemo } from 'react';
import TurnosEscalasModal from "../components/Turnos/TurnosEscalasModal"; 

// --- Dados Mockados (Simulação) ---
const mockColaboradores = [
  { id: 101, nome: "Dr. Bumbum", crm: "14515125125", funcao: "Cirurgião" },
  { id: 102, nome: "Dra. Ana", crm: "98765432123", funcao: "Clínico Geral" },
  { id: 103, nome: "Enf. João", crm: "11223344112", funcao: "Enfermeiro" },
];

// Matriz simulada por Setor (1: Com Cobertura, 0: Sem Cobertura/Lacuna)
const mockMatriz = {
  Emergencia: { 
    horas: [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    lacunas: "Lacunas: 4h–7h, 13h–16h"
  },
  Triagem: { 
    horas: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    lacunas: "Lacunas: 0h–7h, 13h–24h"
  },
  Observacao: { 
    horas: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    lacunas: "Lacunas: 0h–7h"
  },
  Medicacao: { 
    horas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    lacunas: "Lacunas: 0h–13h"
  },
};

const mockEscalaDetalhe = {
    'Emergencia-8': [mockColaboradores[0]], 
    'Emergencia-1': [mockColaboradores[1], mockColaboradores[2]], 
    'Triagem-9': [mockColaboradores[1]], 
};

// --- LÓGICA DE FILTRO E MOCKS ---

const formatDate = (date) => {
    const options = { weekday: 'short', day: '2-digit', month: '2-digit' };
    let formatted = date.toLocaleDateString('pt-BR', options);
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted.replace(', ', ' - ');
};

const generateDateOptions = (daysCount = 5) => {
    const today = new Date();
    const dates = [];
    for (let i = daysCount; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
    }
    dates.push(formatDate(today) + " (Hoje)");
    for (let i = 1; i <= daysCount; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(formatDate(date));
    }
    return dates;
};

const dateOptions = generateDateOptions(5);
const functionOptions = ["Todas", "Médico", "Enfermeira", "Técnico"];
const sectorOptions = ["Todos", "Emergência", "Triagem", "Observação", "Medicação"];

const allSectorKeys = Object.keys(mockMatriz);

// MAPEAMENTO DE FUNÇÃO PARA SETORES RELEVANTES (SIMULAÇÃO)
const functionToSectorMap = {
    "Médico": ["Emergencia", "Observacao"],
    "Enfermeira": ["Triagem", "Medicacao"],
    "Técnico": ["Medicacao"],
    "Todas": allSectorKeys
};


export function Turnos() {
  const [modalData, setModalData] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(dateOptions[5]); 
  const [selectedFunction, setSelectedFunction] = useState(functionOptions[0]); // Estado para o filtro de Função
  const [selectedSector, setSelectedSector] = useState(sectorOptions[0]); 


  // LÓGICA DE FILTRAGEM (FUNÇÃO E SETOR COMBINADOS)
  const filteredSectors = useMemo(() => {
    
    // 1. Filtrar pela Função (Simulação)
    let sectorsByFunction = functionToSectorMap[selectedFunction] || allSectorKeys;

    // 2. Filtrar pelo Setor Específico
    if (selectedSector === "Todos") {
      return sectorsByFunction;
    }
    
    const normalizedSelectedSector = selectedSector.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (sectorsByFunction.includes(normalizedSelectedSector)) {
        return [normalizedSelectedSector];
    }
  
    return [];

  }, [selectedFunction, selectedSector]);


  // Função que lida com o clique na célula
  const handleCellClick = (setor, hora, status) => {
    const key = `${setor}-${hora}`;
    let colaboradoresEscalados;
    
    if (status === 1) {
        colaboradoresEscalados = mockEscalaDetalhe[key] || [mockColaboradores[0]]; 
    } else {
        colaboradoresEscalados = []; 
    }

    setModalData({
      setor,
      hora,
      status, 
      colaboradores: colaboradoresEscalados,
    });
  };
  
  const closeModal = () => setModalData(null);

  const horas = Array.from({ length: 24 }, (_, i) => i); 

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 2. BARRA DE FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          
          {/* Dropdowns de Filtro */}
          <div className="flex gap-4">
            
            {/* Filtro de Data */}
            <div className="w-40 relative">
                <label htmlFor="filter-data" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Data</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-data"
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {dateOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>

            {/* Filtro de Função */}
            <div className="w-40 relative">
                <label htmlFor="filter-funcao" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Função</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-funcao"
                    value={selectedFunction} 
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {functionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
            
            {/* Filtro de Setor */}
            <div className="w-40 relative">
                <label htmlFor="filter-setor" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Setor</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-setor"
                    value={selectedSector} 
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {sectorOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>

          </div>
          
          {/* Contagem de Colaboradores */}
          <div className="p-2 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-semibold text-center">
            Colaboradores Disponíveis: 45
          </div>
        </div>

        {/* Busca */}
        <div className="relative flex items-center w-full">
            <svg className="h-5 w-5 text-gray-400 absolute left-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            <input 
                type="text" 
                placeholder="Buscar colaborador por nome ou CPF..." 
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <svg className="h-5 w-5 text-gray-400 absolute right-3 cursor-pointer hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
        </div>
      </div>

      {/* 3. MATRIZ DE COBERTURA */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Matriz de Cobertura por Setor (24 horas)</h2>
        
        <div className="min-w-[1200px]"> {/* Container para scroll horizontal */}
            
            {/* Cabeçalho das Horas (0h, 1h, ... 23h) */}
            <div className="grid grid-cols-[120px_repeat(24,_1fr)] text-center text-xs font-medium border-b border-gray-300 pb-1">
                <div className="text-left font-semibold text-sm">Setor</div>
                {horas.map(h => (
                    <div key={h} className="text-gray-500">{h}h</div>
                ))}
            </div>

            {/* Linhas da Matriz (Setores) */}
            {filteredSectors.length > 0 ? (
                filteredSectors.map(setorKey => ( 
                    <div key={setorKey} className="grid grid-cols-[120px_repeat(24,_1fr)] items-start border-b border-gray-100 last:border-b-0 py-2">
                        
                        {/* Coluna do Setor e Lacunas */}
                        <div className="text-sm font-medium text-gray-700 h-full flex flex-col justify-start pt-1 pr-2">
                            <span className="mb-1">{setorKey}</span>
                            <span className="text-[10px] text-red-600 flex items-center gap-1">
                                <span className="text-red-500">⚠</span> {mockMatriz[setorKey].lacunas}
                            </span>
                        </div>

                        {/* Células de Cobertura/Lacuna (24 horas) */}
                        {mockMatriz[setorKey].horas.map((status, index) => {
                            const cellClass = status === 1 
                                ? 'bg-blue-400 hover:bg-blue-500' // Cobertura (Azul)
                                : 'bg-red-400 hover:bg-red-500';  // Lacuna (Vermelho)

                            return (
                                <div 
                                    key={index} 
                                    onClick={() => handleCellClick(setorKey, index, status)}
                                    className={`${cellClass} h-8 cursor-pointer rounded-sm mx-[1px] transition duration-150`}
                                >
                                    {/* Células vazias que reagem ao clique */}
                                </div>
                            );
                        })}
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">
                    Nenhum setor encontrado para os filtros selecionados.
                </div>
            )}
        </div>
        
        {/* Legenda */}
        <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-400 rounded-sm"></span>
                <span>Com Cobertura</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-400 rounded-sm"></span>
                <span>Lacuna (Sem Cobertura)</span>
            </div>
        </div>
      </div>

      {/* 4. MODAL/POP-UP */}
      {modalData && (
        <TurnosEscalasModal 
            data={modalData} 
            onClose={closeModal} 
        />
      )}
    </div>
  );
}