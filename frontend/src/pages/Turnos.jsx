import React, { useState, useMemo } from 'react';
import { TurnosEscalasModal } from "../components/turnos/TurnosEscalasModal"; 
import { SearchBar } from '../components/SearchBar';
import { FilterSelect } from '../components/FilterSelect';

// Imports de ícones...
import WarningIcon from '../components/icons/WarningIcon';

// --- DADOS MOCKADOS ---
const mockColaboradores = [
  { id: 101, nome: "Dr. Bumbum", crm: "14515125125", funcao: "Cirurgião" },
  { id: 102, nome: "Dra. Ana", crm: "98765432123", funcao: "Clínico Geral" },
  { id: 103, nome: "Enf. João", crm: "11223344112", funcao: "Enfermeiro" },
];

const mockMatriz = {
  Emergência: { horas: [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], lacunas: "Lacunas: 4h–7h, 13h–16h" },
  Triagem: { horas: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], lacunas: "Lacunas: 0h–7h, 13h–24h" },
  Observação: { horas: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], lacunas: "Lacunas: 0h–7h" },
  Medicação: { horas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], lacunas: "Lacunas: 0h–13h" },
};

const mockEscalaDetalhe = {
    'Emergencia-8': [mockColaboradores[0]], 
    'Emergencia-1': [mockColaboradores[1], mockColaboradores[2]], 
    'Triagem-9': [mockColaboradores[1]], 
};

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
const functionToSectorMap = {
    "Médico": ["Emergencia", "Observacao"],
    "Enfermeira": ["Triagem", "Medicacao"],
    "Técnico": ["Medicacao"],
    "Todas": allSectorKeys
};

// --- COMPONENTE PRINCIPAL ---

export function Turnos() {
  const [modalData, setModalData] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(dateOptions[5]); 
  const [selectedFunction, setSelectedFunction] = useState(functionOptions[0]); 
  const [selectedSector, setSelectedSector] = useState(sectorOptions[0]); 
  const [searchTerm, setSearchTerm] = useState(""); 

  const filteredSectors = useMemo(() => {
    let sectorsByFunction = functionToSectorMap[selectedFunction] || allSectorKeys;
    if (selectedSector === "Todos") return sectorsByFunction;
    const normalizedSelectedSector = selectedSector.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (sectorsByFunction.includes(normalizedSelectedSector)) return [normalizedSelectedSector];
    return [];
  }, [selectedFunction, selectedSector]);

  const handleCellClick = (setor, hora, status) => {
    const key = `${setor}-${hora}`;
    let colaboradoresEscalados = status === 1 ? mockEscalaDetalhe[key] || [mockColaboradores[0]] : [];
    setModalData({ setor, hora, status, colaboradores: colaboradoresEscalados });
  };
  
  const closeModal = () => setModalData(null);
  const horas = Array.from({ length: 24 }, (_, i) => i); 

  return (
    <div className="p-8 pt-4 bg-LightGrey min-h-full">

      {/* BARRA DE FILTROS */}
      <div className="bg-PureWhite p-6 pt-4 pb-4 rounded-xl shadow-sm border border-LightGrey mb-4">

        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            
            <FilterSelect 
              label="Data"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              options={dateOptions}
              className="w-full sm:w-48"
            />

            <FilterSelect 
              label="Função"
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              options={functionOptions}
              className="w-full sm:w-48"
            />
            
            <FilterSelect 
              label="Setor"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              options={sectorOptions}
              className="w-full sm:w-48"
            />

          </div>
          
          {/* Badge de Contagem */}
          <div className="px-4 py-2 bg-blue-50 text-Blue3 border border-blue-100 rounded-lg font-semibold text-sm whitespace-nowrap">
            45 Colaboradores
          </div>
        </div>

        {/* BUSCA */}
        <div className="mt-4 pt-4 border-t border-LightGrey">
            <SearchBar 
                placeholder="Filtrar colaborador..." 
                onSearch={(texto) => setSearchTerm(texto)} 
                className="w-full"
            />
        </div>

      </div>

      {/* MATRIZ DE COBERTURA */}
      <div className="bg-PureWhite p-6 rounded-xl shadow-sm border border-LightGrey overflow-x-auto">
        <h2 className="text-lg font-bold text-Black mb-6">Matriz de Cobertura (24h)</h2>
        
        <div className="min-w-[1200px]">
            {/* Cabeçalho */}
            <div className="flex border-b border-LightGrey pb-2 mb-2">
                <div className="w-[150px] shrink-0 pl-2 text-xs font-bold text-Grey text-left uppercase tracking-wide">SETOR</div>
                <div className="flex-1 grid grid-cols-[repeat(24,_1fr)] text-center text-xs font-bold text-Grey">
                    {horas.map(h => <div key={h}>{h}h</div>)}
                </div>
            </div>

            {/* Linhas */}
            {filteredSectors.length > 0 ? (
                filteredSectors.map(setorKey => ( 
                    <div key={setorKey} className="flex items-center border-b border-LightGrey last:border-b-0 py-4 hover:bg-gray-50 transition-colors">
                        
                        {/* ESQUERDA: Nome */}
                        <div className="w-[150px] shrink-0 pl-2 pr-4 border-r border-LightGrey mr-2">
                            <span className="text-sm font-bold text-Black block">{setorKey}</span>
                        </div>

                        {/* DIREITA: Barras + Texto */}
                        <div className="flex-1 flex flex-col justify-center">
                            
                            {/* Barras */}
                            <div className="grid grid-cols-[repeat(24,_1fr)] gap-[2px] mb-1">
                                {mockMatriz[setorKey].horas.map((status, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleCellClick(setorKey, index, status)}
                                        className={`
                                            h-10 rounded cursor-pointer transition-all duration-200
                                            ${status === 1 
                                                ? 'bg-Blue1 hover:bg-Blue3' 
                                                : 'bg-red-200 hover:bg-red-400'
                                            }
                                        `}
                                        title={status === 1 ? "Cobertura OK" : "Sem Cobertura"}
                                    ></div>
                                ))}
                            </div>

                            {/* Texto de Lacuna (Embaixo) */}
                            <div className="h-4 pl-1">
                                {mockMatriz[setorKey].lacunas && (
                                    <span className="mt-1 text-xs font-bold text-Red flex items-center gap-1 animate-pulse">
                                        <WarningIcon className="w-4 h-4"/>
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

      {/* MODAL */}
      {modalData && (
        <TurnosEscalasModal 
            data={modalData} 
            onClose={closeModal} 
        />
      )}
      
    </div>
  );
}