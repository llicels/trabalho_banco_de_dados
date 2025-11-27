import React, { useEffect, useMemo, useState } from 'react';
import DetalhesExameModal from '../components/exames/DetalhesExameModal';
import { SearchBar } from '../components/SearchBar'; 
import { FilterSelect } from '../components/FilterSelect'; // Componente padrão
import { examesService } from '../services/api';

const defaultStatusOptions = ["Todos", "Pronto", "Pendente", "Coletado"];
const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];

export function Exames() {
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

    useEffect(() => {
        let ativo = true;
        async function carregar() {
            setLoading(true);
            setError('');
            try {
                const dados = await examesService.getResumo(30);
                if (!ativo) return;
                setExames(dados);
                const tipos = Array.from(new Set(dados.map((exame) => exame.tipo))).filter(Boolean);
                setTipoOptions(['Todos', ...tipos]);
                
                // Atualiza status se houver novos status vindos do back
                const status = Array.from(new Set(dados.map((exame) => exame.status))).filter(Boolean);
                // Opcional: merge com default
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

    // Lógica para filtrar a lista de exames
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

        return list;
    }, [exames, searchTerm, selectedStatus, selectedTipo]);

    const handleOpenExameDetails = (exame) => {
        setSelectedExame(exame);
    };

    const handleCloseExameDetails = () => {
        setSelectedExame(null);
    };
    
    const examesPendentesCount = exames.filter(e => e.status === 'Pendente').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pronto': return 'text-green-600 font-bold';
            case 'Pendente': return 'text-yellow-600 font-bold';
            case 'Coletado': return 'text-blue-600 font-bold';
            default: return 'text-Grey';
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
                    Carregando exames...
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
                            className="w-full sm:w-40"
                        />
                    </div>
                    
                    {/* Badge de Contagem */}
                    {/* Usando amarelo para 'Pendente' manter consistência semântica */}
                    <div className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-semibold text-sm whitespace-nowrap">
                        Exames Pendentes: {examesPendentesCount}
                    </div>
                </div>

                {/* Busca (Separada por borda) */}
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

            {/* 3. TABELA DE EXAMES */}
            <div className="bg-PureWhite rounded-xl shadow-sm border border-LightGrey overflow-hidden">
                <h2 className="text-lg font-bold text-Black p-6 pb-2">Resultados Recentes</h2>

                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] px-6 py-3 border-b border-LightGrey text-xs font-bold text-Grey uppercase tracking-wide">
                    <div>Paciente</div>
                    <div>Tipo de Exame</div>
                    <div>Status</div>
                    <div>Data Solicitação</div>
                    <div>Data Resultado</div>
                </div>

                {/* Corpo da Tabela */}
                {filteredExames.length > 0 ? (
                    filteredExames.map(exame => (
                        <button
                            key={exame.id}
                            onClick={() => handleOpenExameDetails(exame)}
                            className="w-full grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] px-6 py-4 text-sm text-left border-b border-LightGrey hover:bg-gray-50 transition items-center last:border-b-0"
                        >
                            <div className="font-bold text-Black">{exame.paciente}</div>
                            <div className="text-Black">{exame.tipo}</div>
                            <div className={getStatusColor(exame.status)}>{exame.status}</div>
                            <div className="text-DarkGrey">{exame.dataSolicitacao}</div>
                            <div className="text-DarkGrey">{exame.dataResultado || '-'}</div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-Grey">
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