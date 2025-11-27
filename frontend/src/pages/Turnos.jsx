import React, { useEffect, useMemo, useState } from 'react';
import { TurnosEscalasModal } from "../components/turnos/TurnosEscalasModal"; 
import { SearchBar } from '../components/SearchBar';
import { FilterSelect } from '../components/FilterSelect';
import WarningIcon from '../components/icons/WarningIcon';
import { turnosService } from '../services/api';

const sectorDefinitions = [
  { key: 'Emergencia', label: 'Emergência' },
  { key: 'Triagem', label: 'Triagem' },
  { key: 'Observacao', label: 'Observação' },
  { key: 'Medicacao', label: 'Medicação' },
];

const sectorLabelMap = sectorDefinitions.reduce((acc, setor) => {
  acc[setor.key] = setor.label;
  return acc;
}, {});

const mapFuncaoParaSetor = (funcao = '') => {
  const normalized = funcao.toLowerCase();
  if (normalized.includes('médico') || normalized.includes('medico') || normalized.includes('dentista')) {
    return 'Emergencia';
  }
  if (normalized.includes('assistente social')) {
    return 'Triagem';
  }
  if (normalized.includes('enfermagem') || normalized.includes('enfermeir')) {
    return 'Observacao';
  }
  if (normalized.includes('técnico') || normalized.includes('tecnico') || normalized.includes('colaborador') || normalized.includes('apoio')) {
    return 'Medicacao';
  }
  return null;
};

// --- ALTERAÇÃO 1: Definimos apenas a data fixa ---
const dateOptions = [
  { label: 'Segunda, 01/01/2024', value: '2024-01-01' }
];

const functionOptions = ["Todas", "Médico", "Enfermagem", "Assistente Social", "Apoio"];
const sectorOptions = ["Todos", ...sectorDefinitions.map((setor) => setor.label)];
const allSectorKeys = sectorDefinitions.map((setor) => setor.key);
const functionToSectorMap = {
  "Médico": ["Emergencia"],
  "Enfermagem": ["Observacao"],
  "Assistente Social": ["Triagem"],
  "Apoio": ["Medicacao"],
  "Todas": allSectorKeys,
};

// --- COMPONENTE PRINCIPAL ---

export function Turnos() {
  // --- ALTERAÇÃO 2: Estado inicial fixo ---
  const [selectedDate, setSelectedDate] = useState('2024-01-01'); 
  
  const [modalData, setModalData] = useState(null); 
  const [selectedFunction, setSelectedFunction] = useState(functionOptions[0]); 
  const [selectedSector, setSelectedSector] = useState(sectorOptions[0]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [escala, setEscala] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      // O loading visualiza que está "buscando" os dados
      setLoading(true);
      setError('');

      // --- MOCK DATA: 13 COLABORADORES ---
      // Data fixa em 2024-01-01 para bater com seu selectedDate
      const dadosMock = [
        // --- SETOR: EMERGÊNCIA (Médicos) [4 Pessoas] ---
        {
          id: '1', nome_colaborador: 'Dr. João Silva', funcao: 'Médico Plantonista',
          hora_chegada: '2024-01-01T07:00:00', hora_saida: '2024-01-01T19:00:00'
        },
        {
          id: '2', nome_colaborador: 'Dra. Maria Costa', funcao: 'Médico Rotina',
          hora_chegada: '2024-01-01T08:00:00', hora_saida: '2024-01-01T17:00:00'
        },
        {
          id: '3', nome_colaborador: 'Dr. Pedro Santos', funcao: 'Médico Noturno',
          hora_chegada: '2024-01-01T19:00:00', hora_saida: '2024-01-01T23:59:59'
        },
        {
          id: '4', nome_colaborador: 'Dra. Ana Luiza', funcao: 'Médico Cirurgião',
          hora_chegada: '2024-01-01T10:00:00', hora_saida: '2024-01-01T16:00:00'
        },

        // --- SETOR: TRIAGEM (Assistente Social) [2 Pessoas] ---
        {
          id: '5', nome_colaborador: 'Sarah Social', funcao: 'Assistente Social',
          hora_chegada: '2024-01-01T08:00:00', hora_saida: '2024-01-01T14:00:00'
        },
        {
          id: '6', nome_colaborador: 'Roberto Apoio', funcao: 'Assistente Social',
          hora_chegada: '2024-01-01T14:00:00', hora_saida: '2024-01-01T20:00:00'
        },

        // --- SETOR: OBSERVAÇÃO (Enfermagem) [3 Pessoas] ---
        {
          id: '7', nome_colaborador: 'Enf. Beatriz', funcao: 'Enfermagem Chefe',
          hora_chegada: '2024-01-01T07:00:00', hora_saida: '2024-01-01T19:00:00'
        },
        {
          id: '8', nome_colaborador: 'Enf. Carlos', funcao: 'Enfermeiro',
          hora_chegada: '2024-01-01T19:00:00', hora_saida: '2024-01-01T23:59:59'
        },
        {
          id: '9', nome_colaborador: 'Enf. Julia', funcao: 'Técnico de Enfermagem', // Vai cair aqui pela palavra 'Enfermagem'
          hora_chegada: '2024-01-01T07:00:00', hora_saida: '2024-01-01T13:00:00'
        },

        // --- SETOR: MEDICAÇÃO (Técnicos/Apoio) [4 Pessoas] ---
        {
          id: '10', nome_colaborador: 'Téc. Lucas', funcao: 'Técnico Geral',
          hora_chegada: '2024-01-01T08:00:00', hora_saida: '2024-01-01T18:00:00'
        },
        {
          id: '11', nome_colaborador: 'Téc. Amanda', funcao: 'Técnico de Apoio',
          hora_chegada: '2024-01-01T12:00:00', hora_saida: '2024-01-01T22:00:00'
        },
        {
          id: '12', nome_colaborador: 'Ricardo Souza', funcao: 'Colaborador Limpeza',
          hora_chegada: '2024-01-01T06:00:00', hora_saida: '2024-01-01T14:00:00'
        },
        {
          id: '13', nome_colaborador: 'Sonia Dias', funcao: 'Apoio Logístico',
          hora_chegada: '2024-01-01T14:00:00', hora_saida: '2024-01-01T22:00:00'
        }
      ];

      setTimeout(() => {
        if (ativo) {
          setEscala(dadosMock);
          setLoading(false);
        }
      }, 500);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [selectedDate]);

  const coverageData = useMemo(() => {
    const matrix = {};
    const cellMap = {};
    sectorDefinitions.forEach(({ key }) => {
      matrix[key] = Array(24).fill(0);
    });

    escala.forEach((colaborador) => {
      const setorKey = mapFuncaoParaSetor(colaborador.funcao || '');
      if (!setorKey) return;
      
      // Ajuste de segurança para datas
      const inicio = new Date(colaborador.hora_chegada);
      const fim = new Date(colaborador.hora_saida);
      if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return;

      const startHour = Math.max(0, inicio.getHours());
      // Lógica mantida: garante que o fim não ultrapasse 24h
      const endHour = Math.min(24, Math.max(startHour + 1, fim.getHours()));

      for (let hour = startHour; hour < endHour; hour += 1) {
        matrix[setorKey][hour] = 1;
        const cellKey = `${setorKey}-${hour}`;
        if (!cellMap[cellKey]) cellMap[cellKey] = [];
        cellMap[cellKey].push({
          id: `${colaborador.nome_colaborador}-${hour}`,
          nome: colaborador.nome_colaborador,
          funcao: colaborador.funcao,
        });
      }
    });

    return { matrix, cellMap };
  }, [escala]);

  const gapSummaries = useMemo(() => {
    const summaries = {};
    Object.entries(coverageData.matrix).forEach(([key, horas]) => {
      const ranges = [];
      let start = null;
      horas.forEach((status, hour) => {
        if (status === 0) {
          if (start === null) start = hour;
        } else if (start !== null) {
          ranges.push([start, hour]);
          start = null;
        }
      });
      if (start !== null) ranges.push([start, 24]);
      summaries[key] = ranges;
    });
    return summaries;
  }, [coverageData.matrix]);

  const filteredSectors = useMemo(() => {
    let sectorsByFunction = functionToSectorMap[selectedFunction] || allSectorKeys;
    let sectorsList = [...sectorsByFunction];

    if (selectedSector !== "Todos") {
      const selectedKey = sectorDefinitions.find((setor) => setor.label === selectedSector)?.key;
      sectorsList = selectedKey ? sectorsList.filter((key) => key === selectedKey) : [];
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      sectorsList = sectorsList.filter((key) =>
        Object.entries(coverageData.cellMap)
          .filter(([cellKey]) => cellKey.startsWith(`${key}-`))
          .some(([, colaboradores]) =>
            colaboradores.some((colaborador) => colaborador.nome.toLowerCase().includes(query))
          )
      );
    }

    return sectorsList;
  }, [selectedFunction, selectedSector, searchTerm, coverageData.cellMap]);

  const handleCellClick = (setorKey, hora, status) => {
    const key = `${setorKey}-${hora}`;
    const colaboradoresEscalados = status === 1 ? (coverageData.cellMap[key] || []) : [];
    setModalData({
      setor: sectorLabelMap[setorKey] || setorKey,
      hora,
      status,
      colaboradores: colaboradoresEscalados,
    });
  };
  
  const closeModal = () => setModalData(null);
  const horas = Array.from({ length: 24 }, (_, i) => i); 

  return (
    <div className="p-8 pt-4 bg-LightGrey min-h-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-white border border-LightGrey rounded-lg text-gray-600 shadow-sm">
          Carregando escala de 01/01/2024...
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-PureWhite p-6 pt-4 pb-4 rounded-xl shadow-sm border border-LightGrey mb-4">

        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            
            <FilterSelect 
              label="Data"
              value={selectedDate}
              // Como só tem uma opção, desabilitar o onChange é opcional, 
              // mas mantê-lo funcionando é mais seguro para o componente.
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
            {escala.length} colaborador(es)
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
        <h2 className="text-lg font-bold text-Black mb-6">Matriz de Cobertura (24h) - 01/01/2024</h2>
        
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
                filteredSectors.map(setorKey => { 
                    const horas = coverageData.matrix[setorKey] || [];
                    const gaps = gapSummaries[setorKey] || [];
                    const gapLabel = gaps.length
                        ? gaps.map(([inicio, fim]) => `${inicio}h–${fim}h`).join(', ')
                        : '';
                    return (
                    <div key={setorKey} className="flex items-center border-b border-LightGrey last:border-b-0 py-4 hover:bg-gray-50 transition-colors">
                        
                        {/* ESQUERDA: Nome */}
                        <div className="w-[150px] shrink-0 pl-2 pr-4 border-r border-LightGrey mr-2">
                            <span className="text-sm font-bold text-Black block">{sectorLabelMap[setorKey] || setorKey}</span>
                        </div>

                        {/* DIREITA: Barras + Texto */}
                        <div className="flex-1 flex flex-col justify-center">
                            
                            {/* Barras */}
                            <div className="grid grid-cols-[repeat(24,_1fr)] gap-[2px] mb-1">
                                {horas.map((status, index) => (
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
                                {gapLabel && (
                                    <span className="mt-1 text-xs font-bold text-Red flex items-center gap-1 animate-pulse">
                                        <WarningIcon className="w-4 h-4"/>
                                        Lacunas: {gapLabel}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                );
                })
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