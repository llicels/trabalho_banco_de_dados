import React, { useEffect, useMemo, useState } from 'react';
import DetalhesTransferenciaModal from '../components/transferencias/DetalhesTransferenciaModal';
import { SearchBar } from '../components/SearchBar'; 
import { transferenciasService } from '../services/api';


const defaultStatusOptions = ["Todos", "Aprovada", "Aguardando", "Rejeitada"];
const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];


export function Transferencias() {
    const [transferencias, setTransferencias] = useState([]);
    const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);
    const [hospitalOptions, setHospitalOptions] = useState(['Todos']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedHospital, setSelectedHospital] = useState(hospitalOptions[0]);
    const [selectedPeriodo, setSelectedPeriodo] = useState(periodoOptions[0]);
    const [selectedTransferencia, setSelectedTransferencia] = useState(null); // Estado para o modal de detalhes

    useEffect(() => {
        let ativo = true;
        async function carregar() {
            setLoading(true);
            setError('');
            try {
                const dados = await transferenciasService.getResumo();
                if (!ativo) return;
                setTransferencias(dados);
                const hospSet = Array.from(new Set(dados.map((t) => t.hospitalDestino))).filter(Boolean);
                setHospitalOptions(['Todos', ...hospSet]);
                const statusSet = Array.from(new Set(dados.map((t) => t.status))).filter(Boolean);
                setStatusOptions(['Todos', ...statusSet]);
            } catch (err) {
                console.error('Erro ao carregar transferências', err);
                if (ativo) setError('Não foi possível carregar as transferências.');
            } finally {
                if (ativo) setLoading(false);
            }
        }

        carregar();
        return () => {
            ativo = false;
        };
    }, []);

    const handleSearchChange = (value) => setSearchTerm(value);

    // Lógica para filtrar a lista de transferências
    const filteredTransferencias = useMemo(() => {
        let list = transferencias;

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

        return list;
    }, [transferencias, searchTerm, selectedStatus, selectedHospital, selectedPeriodo]);

    const handleOpenTransferenciaDetails = (transferencia) => {
        setSelectedTransferencia(transferencia);
    };

    const handleCloseTransferenciaDetails = () => {
        setSelectedTransferencia(null);
    };
    
    // Cálculo de transferências aguardando
    const aguardandoCount = transferencias.filter(t => t.status === 'Aguardando').length;

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
        <div className="p-6 bg-gray-50 min-h-screen">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="p-10 bg-white rounded-xl shadow-xl border border-gray-200 text-center text-gray-500">
                    Carregando transferências...
                </div>
            ) : (
                <>
            
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

                        {/* Hospital Destino */}
                        <div className="w-40 relative">
                            <label htmlFor="filter-hospital" className="text-xs font-medium text-gray-500 absolute -top-4 left-0">Hospital Destino</label>
                            <select 
                                id="filter-hospital"
                                value={selectedHospital} 
                                onChange={(e) => setSelectedHospital(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700"
                            >
                                {hospitalOptions.map(option => (<option key={option} value={option}>{option}</option>))}
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
                    
                    {/* Contagem Aguardando */}
                    <div className="p-2 border border-yellow-600 rounded-lg bg-yellow-50 text-yellow-800 font-semibold text-center">
                        Aguardando Transferência: {aguardandoCount}
                    </div>
                </div>

                {/* Busca */}
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
                </>
            )}
        </div>
    );
}