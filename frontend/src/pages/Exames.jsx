import React, { useState, useMemo } from 'react';
import DetalhesExameModal from '../components/exames/DetalhesExameModal';
import { SearchBar } from '../components/SearchBar'; 
import { FilterSelect } from '../components/FilterSelect';


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
        <div className="p-8 pt-4 bg-gray-50 min-h-full">
          
           {/* BARRA DE FILTROS */}
            <div className="bg-white p-6 pt-4 pb-4 rounded-xl shadow-sm border border-gray-200 mb-4">

            <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">

                <FilterSelect 
                    label="Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    options={statusOptions}
                    className="w-full sm:w-48"
                />

                <FilterSelect 
                    label="Tipo de Exame"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    options={tipoOptions}
                    className="w-full sm:w-48"
                />

                <FilterSelect 
                    label="Período"
                    value={selectedPeriodo}
                    onChange={(e) => setSelectedPeriodo(e.target.value)}
                    options={periodoOptions}
                    className="w-full sm:w-48"
                />

                </div>

                {/* Badge de Pendentes */}
                <div className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-semibold text-sm whitespace-nowrap">
                Exames Pendentes: {examesPendentesCount}
                </div>

            </div>

            {/* BUSCA */}
            <div className="mt-4 pt-4 border-t border-gray-200">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
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