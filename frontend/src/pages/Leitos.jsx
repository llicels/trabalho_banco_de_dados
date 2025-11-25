import React, { useEffect, useMemo, useState } from 'react';
import MapaAlaModal from '../components/leitos/MapaAlaModal';
import DetalhesOcupacaoModal from '../components/leitos/DetalhesOcupacaoModal';
import AtribuirPacienteModal from '../components/leitos/AtribuirPacienteModal';
import MudarStatusModal from '../components/leitos/MudarStatusModal';
import { FilterSelect } from '../components/FilterSelect'; // Importando componente padrão
import { leitosService } from '../services/api';

const tipoOptions = ['Todos', 'Emergência', 'Comum'];
const riscoOptions = ['Todos', 'Alto', 'Médio', 'Baixo'];
const statusOptions = ['Todos', 'Livre', 'Ocupado'];

export function Leitos() {
    const [alas, setAlas] = useState([]);
    const [salasExames, setSalasExames] = useState([]);
    const [historicoOcupacao, setHistoricoOcupacao] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedAla, setSelectedAla] = useState(null); 
    const [selectedDetalhe, setSelectedDetalhe] = useState(null); 
    const [selectedAtribuicao, setSelectedAtribuicao] = useState(null); 
    const [selectedStatusChange, setSelectedStatusChange] = useState(null); 
    const [activeTab, setActiveTab] = useState('Leitos');

    // Filtros de simulação
    const [tipoFiltro, setTipoFiltro] = useState('Todos');
    const [riscoFiltro, setRiscoFiltro] = useState('Todos');
    const [statusFiltro, setStatusFiltro] = useState('Todos');

    useEffect(() => {
        let ativo = true;
        async function carregarDados() {
            setLoading(true);
            setError('');
            try {
                const dados = await leitosService.getResumo();
                if (!ativo) return;
                setAlas(dados.alas || []);
                setSalasExames(dados.salas || []);
                setHistoricoOcupacao(dados.historico || []);
            } catch (err) {
                console.error('Erro ao carregar leitos', err);
                if (ativo) setError('Não foi possível carregar os dados de leitos.');
            } finally {
                if (ativo) setLoading(false);
            }
        }

        carregarDados();
        return () => {
            ativo = false;
        };
    }, []);

    const totalLeitos = useMemo(
        () => alas.reduce((acc, ala) => acc + ala.total, 0),
        [alas]
    );
    const leitosDisponiveis = useMemo(
        () => alas.reduce((acc, ala) => acc + ala.livres, 0),
        [alas]
    );

    // --- Funções de Abertura/Fechamento dos Modais ---
    const handleOpenAlaMap = (ala) => setSelectedAla(ala);
    const handleOpenDetalhe = (leito) => setSelectedDetalhe(leito);

    const handleLeitoAction = (leito, actionType) => {
        setSelectedAla(null); 
        if (actionType === 'Detalhes') setSelectedDetalhe(leito); 
        else if (actionType === 'Atribuir') setSelectedAtribuicao(leito); 
        else if (actionType === 'MudarStatus') setSelectedStatusChange(leito); 
    };
    
    const handleCloseAlaMap = () => setSelectedAla(null);
    const handleCloseDetalhe = () => setSelectedDetalhe(null);
    const handleCloseAtribuicao = () => setSelectedAtribuicao(null);
    const handleCloseStatusChange = () => setSelectedStatusChange(null);

    const filteredAlas = useMemo(() => {
        return alas.filter(ala => {
            const tipoMatch = tipoFiltro === 'Todos' || ala.tipo === tipoFiltro;
            const riscoMatch = riscoFiltro === 'Todos' || ala.risco === riscoFiltro;
            const statusMatch = statusFiltro === 'Todos' || ala.leitos?.some(l => l.status === statusFiltro);
            return tipoMatch && riscoMatch && statusMatch;
        });
    }, [alas, tipoFiltro, riscoFiltro, statusFiltro]);

    // Função auxiliar para cores de status/risco (Atualizada para tons pastéis)
    const getColorClass = (statusOrRisco) => {
        switch (statusOrRisco) {
            case 'Livre':
            case 'Baixo':
                return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100';
            case 'Ocupado':
            case 'Alto':
                return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100';
            case 'Manutencao':
            case 'Médio':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100';
        }
    };

    return (
        <div className="p-8 pt-4 bg-gray-50 min-h-screen">
            
            {/* 1. FILTROS E CONTADORES (Header Card) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                    
                    {/* Filtros Padronizados */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <FilterSelect
                            label="Tipo de Sala"
                            value={tipoFiltro}
                            onChange={(e) => setTipoFiltro(e.target.value)}
                            options={tipoOptions}
                            className="w-full sm:w-48"
                        />
                        <FilterSelect
                            label="Risco"
                            value={riscoFiltro}
                            onChange={(e) => setRiscoFiltro(e.target.value)}
                            options={riscoOptions}
                            className="w-full sm:w-48"
                        />
                        <FilterSelect
                            label="Status"
                            value={statusFiltro}
                            onChange={(e) => setStatusFiltro(e.target.value)}
                            options={statusOptions}
                            className="w-full sm:w-48"
                        />
                    </div>

                    {/* Contadores (Badges) */}
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-semibold text-sm">
                            Alas: {alas.length}
                        </div>
                        <div className="px-4 py-2 bg-green-50 text-green-800 border border-green-200 rounded-lg font-semibold text-sm">
                            Disponíveis: {leitosDisponiveis}/{totalLeitos}
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-2 text-blue-800 font-bold">Carregando dados em tempo real...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                    
                    {/* 2. ABAS DE NAVEGAÇÃO */}
                    <div className="flex border-b border-gray-200 bg-gray-50/50 px-6">
                        <button
                            onClick={() => setActiveTab('Leitos')}
                            className={`py-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'Leitos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                        >
                            Mapa de Leitos e Salas
                        </button>
                        <button
                            onClick={() => setActiveTab('Historico')}
                            className={`py-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'Historico' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                        >
                            Histórico de Ocupação
                        </button>
                    </div>

                    {/* CONTEÚDO DA ABA ATIVA */}
                    <div className="p-6">
                        
                        {/* ABA 1: MAPA DE LEITOS E SALAS */}
                        {activeTab === 'Leitos' && (
                            <div className="space-y-8 animate-fadeIn">
                                
                                {/* MAPA DA ALA DE LEITOS */}
                                <div>
                                    <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                        Alas de Internação
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {filteredAlas.map(ala => (
                                            <button 
                                                key={ala.nome}
                                                onClick={() => handleOpenAlaMap(ala)}
                                                className={`p-5 border rounded-xl shadow-sm transition-all transform hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between h-40 ${getColorClass(ala.risco)}`}
                                            >
                                                <div>
                                                    <p className="font-bold text-lg mb-1">{ala.nome}</p>
                                                    <p className="text-xs opacity-80 font-semibold uppercase tracking-wide">{ala.tipo}</p>
                                                </div>
                                                <div className="mt-2 w-full">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-sm font-medium">Ocupação</span>
                                                        <span className="text-sm font-bold">{ala.ocupados}/{ala.total}</span>
                                                    </div>
                                                    {/* Barra de progresso visual */}
                                                    <div className="w-full bg-black/10 h-1.5 rounded-full">
                                                        <div className="bg-current h-1.5 rounded-full" style={{ width: `${(ala.ocupados/ala.total)*100}%` }}></div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Legenda */}
                                    <div className="mt-6 flex gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> Alto Risco</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Médio Risco</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Baixo Risco</div>
                                    </div>
                                </div>

                                {/* STATUS DAS SALAS DE EXAMES */}
                                <div>
                                    <h3 className="text-gray-800 font-bold text-lg mb-4 pt-6 border-t border-gray-100 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                                        Salas de Exames
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {salasExames.map(sala => (
                                            <div 
                                                key={sala.id || sala.nome}
                                                className={`p-5 border rounded-xl shadow-sm text-left flex flex-col justify-between h-32 ${getColorClass(sala.status)}`}
                                            >
                                                <div>
                                                    <p className="font-bold text-lg mb-1">{sala.nome}</p>
                                                    <p className="text-xs opacity-80 font-semibold uppercase">{sala.tipo}</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-bold bg-white/60 px-2 py-0.5 rounded">{sala.status}</span>
                                                    {sala.liberacao && sala.liberacao !== '-' && (
                                                        <span className="text-xs font-medium">Lib: {sala.liberacao}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA 2: HISTÓRICO DE OCUPAÇÃO */}
                        {activeTab === 'Historico' && (
                            <div className="animate-fadeIn">
                                <div className="grid grid-cols-5 p-4 text-sm font-bold text-gray-600 bg-gray-50 rounded-t-lg border-b border-gray-200">
                                    <div>Leito</div>
                                    <div>Paciente</div>
                                    <div>Entrada</div>
                                    <div>Saída</div>
                                    <div>Duração</div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {historicoOcupacao.map((item, idx) => (
                                        <button
                                            key={item.passagemId || idx}
                                            onClick={() => handleOpenDetalhe(item)} 
                                            className="w-full grid grid-cols-5 p-4 text-sm text-left hover:bg-blue-50/50 transition items-center group"
                                        >
                                            <div className="font-bold text-blue-700 group-hover:text-blue-800">{item.leitoNome}</div>
                                            <div className="text-gray-800 font-medium">{item.paciente}</div>
                                            <div className="text-gray-600">{item.dataOcupacao}</div>
                                            <div className="text-gray-600">{item.dataLiberacao}</div>
                                            <div className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded w-fit text-xs border border-gray-200">
                                                {item.duracao}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {historicoOcupacao.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 italic">
                                        Nenhum histórico recente encontrado.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAIS */}
            {selectedAla && (
                <MapaAlaModal 
                    ala={selectedAla} 
                    onClose={handleCloseAlaMap} 
                    onLeitoAction={handleLeitoAction} 
                />
            )}
            
            {selectedDetalhe && (
                <DetalhesOcupacaoModal 
                    leito={selectedDetalhe} 
                    onClose={handleCloseDetalhe} 
                />
            )}
            
            {selectedAtribuicao && (
                <AtribuirPacienteModal
                    leito={selectedAtribuicao}
                    onClose={handleCloseAtribuicao}
                />
            )}

            {selectedStatusChange && (
                <MudarStatusModal
                    leito={selectedStatusChange}
                    onClose={handleCloseStatusChange}
                />
            )}
        </div>
    );
}