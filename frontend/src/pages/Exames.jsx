import React, { useEffect, useMemo, useState } from 'react';
import DetalhesExameModal from '../components/exames/DetalhesExameModal';
import { SearchBar } from '../components/SearchBar'; 
import { FilterSelect } from '../components/FilterSelect'; // Certifique-se de ter este componente
import { examesService } from '../services/api';

const defaultStatusOptions = ["Todos", "Pronto", "Pendente", "Coletado"];
const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];

export function Exames() {
    // --- ESTADOS ---
    const [exames, setExames] = useState([]);
    const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);
    const [tipoOptions, setTipoOptions] = useState(['Todos']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedTipo, setSelectedTipo] = useState(tipoOptions[0]);
    const [selectedPeriodo, setSelectedPeriodo] = useState(periodoOptions[0]);
    const [selectedExame, setSelectedExame] = useState(null);

    // --- EFEITOS ---
    useEffect(() => {
        let ativo = true;
        async function carregar() {
            setLoading(true);
            setError('');
            try {
                const dados = await examesService.getResumo(30);
                if (!ativo) return;
                setExames(dados);
                
                // Extrai tipos únicos dinamicamente
                const tipos = Array.from(new Set(dados.map((exame) => exame.tipo))).filter(Boolean);
                setTipoOptions(['Todos', ...tipos]);
                
                // Se quiser extrair status dinamicamente também, descomente abaixo, 
                // senão usa o defaultStatusOptions
                const status = Array.from(new Set(dados.map((exame) => exame.status))).filter(Boolean);
                setStatusOptions(['Todos', ...status]);

            } catch (err) {
                console.error('Erro ao carregar exames', err);
                if (ativo) setError('Não foi possível carregar os exames.');
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

    // --- FILTROS ---
    const filteredExames = useMemo(() => {
        let list = exames;

        // 1. Filtro de Busca (Paciente por nome/CPF)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            list = list.filter(exame => 
                exame.paciente.toLowerCase().includes(query) || 
                (exame.cpf && exame.cpf.includes(query))
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
        
        // 4. Filtro de Período
        // Por enquanto, apenas o estado existe, mas não filtra datas reais na lógica original.

        return list;
    }, [exames, searchTerm, selectedStatus, selectedTipo, selectedPeriodo]);

    const handleOpenExameDetails = (exame) => {
        setSelectedExame(exame);
    };

    const handleCloseExameDetails = () => {
        setSelectedExame(null);
    };
    
    // Cálculo de exames pendentes
    const examesPendentesCount = exames.filter(e => e.status === 'Pendente').length;

    // Função auxiliar para classes de status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pronto': return 'text-green-600 font-semibold';
            case 'Pendente': return 'text-yellow-600 font-semibold';
            case 'Coletado': return 'text-blue-600 font-semibold';
            case 'Cancelado': return 'text-red-600 font-semibold';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="p-8 pt-4 bg-gray-50 min-h-full">
            
            {/* Tratamento de Erro Visual */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
          
            {loading ? (
                <div className="p-10 bg-white rounded-xl shadow-xl border border-gray-200 text-center text-gray-500">
                    Carregando exames...
                </div>
            ) : (
                <>
                    {/* BARRA DE FILTROS */}
                    <div className="bg-white p-6 pt-4 pb-4 rounded-xl shadow-sm border border-gray-200 mb-4">
                        
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                            
                            {/* Inputs de Filtro */}
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

                    {/* TABELA DE EXAMES */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Cabeçalho da Tabela */}
                        <div className="grid grid-cols-6 p-4 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50/50">
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
                                    className="w-full grid grid-cols-6 p-4 text-sm text-left border-b border-gray-100 hover:bg-gray-50 transition last:border-0"
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
                </>
            )}
        </div>
    );
}