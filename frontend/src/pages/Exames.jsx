import React, { useState, useMemo } from 'react';
import DetalhesExameModal from '../components/exames/DetalhesExameModal';
import { SearchBar } from '../components/SearchBar'; 


// --- Dados Mockados ---
const mockExames = [
    { id: 1, paciente: "João da Silva", tipo: "Hemograma", status: "Pronto", dataSolicitacao: "20/11/2025", dataResultado: "24/11/2025", solicitante: "Dr. André", resultadoDetalhes: "Leucócitos: 8.5 (Normal). Hemoglobina: 14.2 (Normal). Observações: Nada digno de nota." },
    { id: 2, paciente: "Maria Souza", tipo: "Ultrassom Abdominal", status: "Pendente", dataSolicitacao: "23/11/2025", dataResultado: "-", solicitante: "Dra. Laura", resultadoDetalhes: "" },
    { id: 3, paciente: "Carlos Nunes", tipo: "Raio-X Tórax", status: "Coletado", dataSolicitacao: "24/11/2025", dataResultado: "-", solicitante: "Dr. André", resultadoDetalhes: "" },
    { id: 4, paciente: "Ana Costa", tipo: "Eletrocardiograma", status: "Pendente", dataSolicitacao: "24/11/2025", dataResultado: "-", solicitante: "Dr. André", resultadoDetalhes: "" },
    { id: 5, paciente: "João da Silva", tipo: "Glicemia", status: "Pronto", dataSolicitacao: "19/11/2025", dataResultado: "20/11/2025", solicitante: "Dra. Laura", resultadoDetalhes: "Glicose: 95 mg/dL (Normal)."},
];

const statusOptions = ["Todos", "Pronto", "Pendente", "Coletado", "Cancelado"];
const tipoOptions = ["Todos", "Hemograma", "Ultrassom Abdominal", "Raio-X Tórax", "Eletrocardiograma", "Glicemia"];
const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];
// -------------------------------------------------------------------------


export function Exames() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedTipo, setSelectedTipo] = useState(tipoOptions[0]);
    const [selectedPeriodo, setSelectedPeriodo] = useState(periodoOptions[0]);
    const [selectedExame, setSelectedExame] = useState(null);

    const handleSearchChange = (value) => setSearchTerm(value);

    //Lógica para filtrar a lista de exames
    const filteredExames = useMemo(() => {
        let list = mockExames;

        // 1. Filtro de Busca (Paciente por nome/CPF)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            list = list.filter(exame => 
                exame.paciente.toLowerCase().includes(query) || 
                (exame.cpf && exame.cpf.includes(query)) // Assumindo que CPF viria nos dados reais
            );
        }

        // 2. Filtro de Status
        if (selectedStatus !== 'Todos') {
            list = list.filter(exame => exame.status === selectedStatus);
        }
        
        // 3. Filtro de Tipo de Exame
        if (selectedTipo !== 'Todos') {
             list = list.filter(exame => exame.tipo === selectedTipo);
        }


        return list;
    }, [searchTerm, selectedStatus, selectedTipo]);

    const handleOpenExameDetails = (exame) => {
        setSelectedExame(exame);
    };

    const handleCloseExameDetails = () => {
        setSelectedExame(null);
    };
    
    // Cálculo de exames pendentes (Simulação)
    const examesPendentesCount = mockExames.filter(e => e.status === 'Pendente').length;

    // Função auxiliar para classes de status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pronto': return 'text-green-600 font-semibold';
            case 'Pendente': return 'text-yellow-600 font-semibold';
            case 'Coletado': return 'text-blue-600 font-semibold';
            default: return 'text-gray-600';
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
          
            {/* 2. BARRA DE FILTROS E BUSCA */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
                
                {/* Filtros Dropdown */}
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                        
                        {/* Status */}
                        <div className="w-40 relative">
                            <label htmlFor="filter-status" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Status</label>
                            <select 
                                id="filter-status"
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                            >
                                {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                            </select>
                            <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>

                        {/* Tipo de Exame */}
                        <div className="w-40 relative">
                            <label htmlFor="filter-tipo" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Tipo de Exame</label>
                            <select 
                                id="filter-tipo"
                                value={selectedTipo} 
                                onChange={(e) => setSelectedTipo(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                            >
                                {tipoOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                            </select>
                            <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                        
                        {/* Período */}
                        <div className="w-40 relative">
                            <label htmlFor="filter-periodo" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Período</label>
                            <select 
                                id="filter-periodo"
                                value={selectedPeriodo} 
                                onChange={(e) => setSelectedPeriodo(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                            >
                                {periodoOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                            </select>
                            <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>

                    </div>
                    
                    {/* Contagem de Pendentes */}
                    <div className="p-2 border border-red-500 rounded-lg bg-red-50 text-red-700 font-semibold text-center">
                        Exames Pendentes: {examesPendentesCount}
                    </div>
                </div>

                {/* Busca (SearchBar) */}
                <div className="relative">
                    <SearchBar
                        placeholder="Buscar paciente por nome ou CPF..."
                        onSearch={handleSearchChange} 
                        onSubmit={handleSearchChange}
                        className="w-full"
                        showFilter={false}
                    />
                </div>
            </div>

            {/* 3. TABELA DE EXAMES */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                
                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-6 p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div>Paciente</div>
                    <div>Tipo de Exame</div>
                    <div>Status</div>
                    <div className="col-span-1">Data Solicitação</div>
                    <div className="col-span-1">Data Resultado</div>
                </div>

                {/* Corpo da Tabela */}
                {filteredExames.length > 0 ? (
                    filteredExames.map(exame => (
                        <button
                            key={exame.id}
                            onClick={() => handleOpenExameDetails(exame)}
                            className="w-full grid grid-cols-6 p-4 text-sm text-left border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                            <div className="font-medium text-gray-900">{exame.paciente}</div>
                            <div className="text-gray-700">{exame.tipo}</div>
                            <div className={getStatusColor(exame.status)}>{exame.status}</div>
                            <div className="col-span-1 text-gray-600">{exame.dataSolicitacao}</div>
                            <div className="col-span-1 text-gray-600">{exame.dataResultado || '-'}</div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum exame encontrado com os filtros e busca aplicados.
                    </div>
                )}
            </div>

            {/* MODAL DE DETALHES DO EXAME */}
            {selectedExame && (
                <DetalhesExameModal 
                    exame={selectedExame} 
                    onClose={handleCloseExameDetails} 
                />
            )}
        </div>
    );
}