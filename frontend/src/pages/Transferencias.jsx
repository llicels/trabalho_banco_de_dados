import React, { useEffect, useMemo, useState } from 'react';
import DetalhesTransferenciaModal from '../components/transferencias/DetalhesTransferenciaModal';
import { SearchBar } from '../components/SearchBar'; 
import { FilterSelect } from '../components/FilterSelect';
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
    const [selectedTransferencia, setSelectedTransferencia] = useState(null);

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

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            list = list.filter(t => 
                t.paciente.toLowerCase().includes(query) || 
                t.cpf.includes(query)
            );
        }

        if (selectedStatus !== 'Todos') {
            list = list.filter(t => t.status === selectedStatus);
        }
        
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

    const transferenciasPendentes = useMemo(() => {
    const statusPendentes = ['Pendente']; 
    
    return transferencias.filter(t => statusPendentes.includes(t.status)).length;
}, [transferencias]);

    const transferenciasEmAndamento = useMemo(() => {
    const statusEmAndamento = ['Em Andamento']; 

    return transferencias.filter(t => statusEmAndamento.includes(t.status)).length;
}, [transferencias]);

    const getStatusColor = (status) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border w-fit";
        switch (status) {
            case 'Aprovada': return `${baseClass} bg-green-50 text-green-700 border-green-200`;
            case 'Aguardando': return `${baseClass} bg-yellow-50 text-yellow-700 border-yellow-200`;
            case 'Rejeitada': return `${baseClass} bg-red-50 text-red-700 border-red-200`;
            default: return `${baseClass} bg-gray-50 text-gray-600 border-gray-200`;
        }
    };

    return (
        <div className="p-8 pt-4 bg-LightGrey min-h-full">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mb-4 p-4 bg-white border border-LightGrey rounded-lg text-gray-600 shadow-sm">
                    Carregando transferências...
                </div>
            ) : (
                <>
            
            {/* 2. BARRA DE FILTROS E BUSCA */}
            <div className="bg-PureWhite p-6 pt-4 pb-4 rounded-xl shadow-sm border border-LightGrey mb-4">
                
                <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                    
                    {/* Filtros Dropdown */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        
                        <FilterSelect 
                            label="Status"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            options={statusOptions}
                            className="w-full sm:w-40"
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
                            className="w-full sm:w-40"
                        />
                    </div>
                    
                    <div className='flex flex-wrap gap-4 w-full lg:w-auto'>
                        {/* Badge de Contagem */}
                        <div className={`px-4 py-2 border rounded-lg font-semibold text-sm whitespace-nowrap transition-colors
                            ${transferenciasPendentes > 0 
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm' // Destaque se houver pendentes
                                : 'bg-gray-50 text-gray-500 border-gray-200 opacity-70' // Discreto se zero
                            }`}>
                            Pendentes: {transferenciasPendentes}
                        </div>
                        {/* Badge de Contagem */}
                        <div className={`px-4 py-2 border rounded-lg font-semibold text-sm whitespace-nowrap transition-colors
                            ${transferenciasEmAndamento > 0 
                                ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' // Destaque se houver pendentes
                                : 'bg-gray-50 text-gray-500 border-gray-200 opacity-70' // Discreto se zero
                            }`}>
                            Em Andamento: {transferenciasEmAndamento}
                        </div>
                    </div>

                </div>

                {/* Busca */}
                <div className="mt-4 pt-4 border-t border-LightGrey">
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
            <div className="bg-PureWhite p-6 rounded-xl shadow-sm border border-LightGrey overflow-hidden">
                <h2 className="text-lg font-bold text-Black mb-6">Solicitações Recentes</h2>

                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] pb-2 mb-2 border-b border-LightGrey text-xs font-bold text-Grey uppercase tracking-wide">
                    <div className="pl-2">Paciente</div>
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
                            className="w-full grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] py-4 text-sm text-left border-b border-LightGrey hover:bg-gray-50 transition items-center last:border-b-0"
                        >
                            <div className="pl-2 font-bold text-Black">{t.paciente}</div>
                            <div className="text-Black">{t.hospitalDestino}</div>
                            
                            {/* Célula do Status com Badge */}
                            <div>
                                <span className={getStatusColor(t.status)}>{t.status}</span>
                            </div>

                            <div className="text-DarkGrey">{t.dataSolicitacao}</div>
                            <div className="text-DarkGrey truncate pr-2" title={t.justificativa}>
                                {t.justificativa}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-Grey">
                        Nenhuma solicitação encontrada com os filtros atuais.
                    </div>
                )}
            </div>

            {/* MODAL */}
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