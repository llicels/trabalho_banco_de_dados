import React, { useState, useMemo } from 'react';
import DetalhesTransferenciaModal from '../components/transferencias/DetalhesTransferenciaModal';
import { SearchBar } from '../components/SearchBar';
import { FilterSelect } from '../components/FilterSelect';


// --- Dados Mockados ---
const mockTransferencias = [
    { 
        id: 1, 
        paciente: "Pedro Alves", 
        cpf: "123.123.123-11", 
        hospitalDestino: "Hospital Central", 
        status: "Aprovada", 
        dataSolicitacao: "20/11/2025", 
        dataAprovacao: "20/11/2025", 
        justificativa: "Necessidade de cirurgia cardíaca especializada que só pode ser realizada no Hospital Central.",
        observacoes: "Transporte agendado para as 16:00h."
    },
    { 
        id: 2, 
        paciente: "Joana Lima", 
        cpf: "456.456.456-44", 
        hospitalDestino: "Hospital Regional Sul", 
        status: "Aguardando", 
        dataSolicitacao: "24/11/2025", 
        dataAprovacao: null, 
        justificativa: "Requer leito de UTI de nível 3, indisponível nesta unidade.",
        observacoes: ""
    },
    { 
        id: 3, 
        paciente: "Marcos Costa", 
        cpf: "789.789.789-77", 
        hospitalDestino: "Hospital Universitário", 
        status: "Rejeitada", 
        dataSolicitacao: "23/11/2025", 
        dataAprovacao: "23/11/2025", 
        justificativa: "O paciente não atende aos critérios de aceitação da unidade.",
        observacoes: "Motivo da rejeição documentado na ficha."
    },
    { 
        id: 4, 
        paciente: "Luiza Santos", 
        cpf: "101.101.101-00", 
        hospitalDestino: "Hospital Central", 
        status: "Aguardando", 
        dataSolicitacao: "24/11/2025", 
        dataAprovacao: null, 
        justificativa: "Transferência solicitada pelo convênio médico.",
        observacoes: "Aguardando confirmação de leito."
    },
];

const statusOptions = ["Todos", "Aprovada", "Aguardando", "Rejeitada"];
const hospitalOptions = ["Todos", "Hospital Central", "Hospital Regional Sul", "Hospital Universitário"];
const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];
// -------------------------------------------------------------------------


export function Transferencias() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedHospital, setSelectedHospital] = useState(hospitalOptions[0]);
    const [selectedPeriodo, setSelectedPeriodo] = useState(periodoOptions[0]);
    const [selectedTransferencia, setSelectedTransferencia] = useState(null); // Estado para o modal de detalhes

    const handleSearchChange = (value) => setSearchTerm(value);

    // Lógica para filtrar a lista de transferências
    const filteredTransferencias = useMemo(() => {
        let list = mockTransferencias;

        // 1. Filtro de Busca (Paciente por nome/CPF)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            list = list.filter(t => 
                t.paciente.toLowerCase().includes(query) || 
                t.cpf.includes(query)
            );
        }

        // 2. Filtro de Status
        if (selectedStatus !== 'Todos') {
            list = list.filter(t => t.status === selectedStatus);
        }
        
        // 3. Filtro de Hospital Destino
        if (selectedHospital !== 'Todos') {
             list = list.filter(t => t.hospitalDestino === selectedHospital);
        }
        
        // (O filtro de Período deve ser implementado aqui)

        return list;
    }, [searchTerm, selectedStatus, selectedHospital, selectedPeriodo]);

    const handleOpenTransferenciaDetails = (transferencia) => {
        setSelectedTransferencia(transferencia);
    };

    const handleCloseTransferenciaDetails = () => {
        setSelectedTransferencia(null);
    };
    
    // Cálculo de transferências aguardando (Simulação)
    const aguardandoCount = mockTransferencias.filter(t => t.status === 'Aguardando').length;

    // Função auxiliar para classes de status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Aprovada': return 'text-green-600 font-semibold';
            case 'Aguardando': return 'text-yellow-600 font-semibold';
            case 'Rejeitada': return 'text-red-600 font-semibold';
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
                    label="Hospital Destino"
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    options={hospitalOptions}
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

                {/* Badge de Contagem */}
                <div className="px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg font-semibold text-sm whitespace-nowrap">
                Aguardando Transferência: {aguardandoCount}
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


            {/* 3. TABELA DE TRANSFERÊNCIAS */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                
                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div>Paciente</div>
                    <div>Hospital Destino</div>
                    <div>Status</div>
                    <div>Data Solicitação</div>
                    <div>Justificativa</div>
                </div>

                {/* Corpo da Tabela */}
                {filteredTransferencias.length > 0 ? (
                    filteredTransferencias.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleOpenTransferenciaDetails(t)}
                            className="w-full grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] p-4 text-sm text-left border-b border-gray-100 hover:bg-gray-50 transition items-center"
                        >
                            <div className="font-medium text-gray-900">{t.paciente}</div>
                            <div className="text-gray-700">{t.hospitalDestino}</div>
                            <div className={getStatusColor(t.status)}>{t.status}</div>
                            <div className="text-gray-600">{t.dataSolicitacao}</div>
                            <div className="text-gray-600 truncate">{t.justificativa}</div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma solicitação de transferência encontrada com os filtros e busca aplicados.
                    </div>
                )}
            </div>

            {/* MODAL DE DETALHES DA TRANSFERÊNCIA */}
            {selectedTransferencia && (
                <DetalhesTransferenciaModal 
                    transferencia={selectedTransferencia} 
                    onClose={handleCloseTransferenciaDetails} 
                />
            )}
        </div>
    );
}