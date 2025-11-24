import React, { useState, useMemo } from 'react';
import TurnosEscalasModal from "../components/turnos/TurnosEscalasModal"; 
import { SearchBar } from '../components/SearchBar';

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

// 💡 MAPEAMENTO DE FUNÇÃO PARA SETORES RELEVANTES (SIMULAÇÃO)
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


  // 💡 LÓGICA DE FILTRAGEM (FUNÇÃO E SETOR COMBINADOS)
  const filteredSectors = useMemo(() => {
    
    // 1. Filtrar pela Função (Simulação)
    let sectorsByFunction = functionToSectorMap[selectedFunction] || allSectorKeys;

    // 2. Filtrar pelo Setor Específico
    if (selectedSector === "Todos") {
      return sectorsByFunction;
    }
    
    const normalizedSelectedSector = selectedSector.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Se a função já filtrou para um subconjunto, verificamos se o setor selecionado está nesse subconjunto.
    if (sectorsByFunction.includes(normalizedSelectedSector)) {
        return [normalizedSelectedSector];
    }
    
    // Se selecionamos um setor específico (ex: "Emergência") e a função está como "Todas", retorna o setor específico.
    // Se o setor não está no conjunto filtrado por função, não retorna nada.
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
    <div className="p-8 pt-4 bg-LightGrey min-h-screen">

      {/* 2. BARRA DE FILTROS E BUSCA */}
      <div className="bg-white p-6 pb-4 rounded-2xl shadow-sm mb-4">
        <div className="flex items-center justify-between">
          
          {/* Dropdowns de Filtro */}
          <div className="flex gap-4">
            
            {/* Filtro de Data */}
            <div className="w-40 relative">
                <label htmlFor="filter-data" className="text-xs font-medium text-DarkGrey absolute -top-4 left-0">Data</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-data"
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full p-2 border border-Grey rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {dateOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>

            {/* Filtro de Função */}
            <div className="w-40 relative">
                <label htmlFor="filter-funcao" className="text-xs font-medium text-DarkGrey absolute -top-4 left-0">Função</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-funcao"
                    value={selectedFunction} 
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="block w-full p-2 border border-Grey rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {functionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
            
            {/* Filtro de Setor */}
            <div className="w-40 relative">
                <label htmlFor="filter-setor" className="text-xs font-medium text-DarkGrey absolute -top-4 left-0">Setor</label> {/* 💡 RÓTULO */}
                <select 
                    id="filter-setor"
                    value={selectedSector} 
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="block w-full p-2 border border-Grey rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                >
                    {sectorOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>

          </div>
          
          {/* Contagem de Colaboradores */}
          <div className="p-2 border border-Blue3 rounded-lg bg-blue-50 text-Blue3 font-semibold text-center">
            Colaboradores Disponíveis: 45
          </div>
        </div>

        {/* Busca */}
        <div className="mt-2">
            <SearchBar 
                placeholder="Buscar colaborador por nome ou CPF..." 
                onSearch={(texto) => setSearchTerm(texto)} 
                className="w-full"
            />
        </div>
      </div>

      {/* 3. MATRIZ DE COBERTURA */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Matriz de Cobertura por Setor (24 horas)</h2>
        
        <div className="min-w-[1200px]">
            
            {/* Cabeçalho */}
            <div className="flex border-b border-gray-300 pb-2 mb-2">
                <div className="w-[150px] shrink-0 pl-2 text-xs font-bold text-Grey text-left">SETOR</div>
                <div className="flex-1 grid grid-cols-[repeat(24,_1fr)] text-center text-xs font-bold text-Grey">
                    {horas.map(h => <div key={h}>{h}h</div>)}
                </div>
            </div>

            {/* Linhas da Matriz */}
            {filteredSectors.length > 0 ? (
                filteredSectors.map(setorKey => ( 
                    <div key={setorKey} className="flex items-center border-b border-LightGrey last:border-b-0 py-4 hover:bg-gray-50 transition-colors">
                        
                        {/* LADO ESQUERDO: Nome do Setor */}
                        <div className="w-[150px] shrink-0 pl-2 pr-4 border-r border-LightGrey mr-2">
                            <span className="text-sm font-bold text-Black block">{setorKey}</span>
                        </div>

                        {/* LADO DIREITO: Container Vertical*/}
                        <div className="flex-1 flex flex-col justify-center">
                            
                            {/* 1. As Barras (Grid de 24) */}
                            <div className="grid grid-cols-[repeat(24,_1fr)] gap-[2px] mb-1">
                                {mockMatriz[setorKey].horas.map((status, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleCellClick(setorKey, index, status)}
                                        className={`
                                            h-10 rounded cursor-pointer transition-all duration-200
                                            ${status === 1 
                                                ? 'bg-Blue1 hover:bg-Blue3 hover:Blue5'
                                                : 'bg-red-400 hover:bg-red-500'
                                            }
                                        `}
                                        title={status === 1 ? "Cobertura OK" : "Sem Cobertura"}
                                    ></div>
                                ))}
                            </div>

                            {/* 2. O Texto de Lacuna */}
                            <div className="h-4">
                                {mockMatriz[setorKey].lacunas && (
                                    <span className="text-[11px] font-bold text-Red flex items-center gap-1 animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="w-3 h-3">
                                            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/>
                                        </svg>
                                        {mockMatriz[setorKey].lacunas}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-Grey">Nenhum setor encontrado.</div>
            )}
        </div>
        
        {/* Legenda */}
        <div className="mt-6 flex items-center gap-6 text-sm border-t border-LightGrey pt-4">
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-Blue1 rounded"></span>
                <span className="text-DarkGrey">Com Cobertura</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-200 rounded"></span>
                <span className="text-DarkGrey">Lacuna (Sem Cobertura)</span>
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