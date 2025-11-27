import React, { useEffect, useMemo, useState } from 'react';
import MapaAlaModal from '../components/leitos/MapaAlaModal';
import DetalhesOcupacaoModal from '../components/leitos/DetalhesOcupacaoModal';
import AtribuirPacienteModal from '../components/leitos/AtribuirPacienteModal';
import MudarStatusModal from '../components/leitos/MudarStatusModal';
import { FilterSelect } from '../components/FilterSelect';
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
    const handleOpenAlaMap = (ala) => {
        setSelectedAla(ala);
    };

    const handleOpenDetalhe = (leito) => {
        setSelectedDetalhe(leito);
    };

    const handleLeitoAction = (leito, actionType) => {
        setSelectedAla(null); 

        if (actionType === 'Detalhes') {
            setSelectedDetalhe(leito); 
        } else if (actionType === 'Atribuir') {
            setSelectedAtribuicao(leito); 
        } else if (actionType === 'MudarStatus') {
            setSelectedStatusChange(leito); 
        }
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

    // Função auxiliar para cores de status/risco (Mantendo semântica mas suavizando bordas)
    const getColorClass = (statusOrRisco) => {
        switch (statusOrRisco) {
            case 'Livre':
            case 'Baixo':
                return 'bg-green-50 text-green-900 border-green-500'; // Suavizado
            case 'Ocupado':
            case 'Alto':
                return 'bg-red-50 text-red-900 border-red-500'; // Suavizado
            case 'Manutencao':
            case 'Médio':
                return 'bg-yellow-50 text-yellow-900 border-yellow-500'; // Suavizado
            default:
                return 'bg-white text-Black border-LightGrey';
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
                    Carregando dados em tempo real...
                </div>
            ) : (
                <>
                    {/* 1. BARRA DE FILTROS E STATS */}
                    <div className="bg-PureWhite p-6 pt-4 pb-4 rounded-xl shadow-sm border border-LightGrey mb-4">
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                            
                            {/* Filtros */}
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

                            {/* Contadores (Estilo Badge) */}
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-blue-50 text-Blue3 border border-blue-100 rounded-lg font-semibold text-sm">
                                    Alas: {alas.length}
                                </div>
                                <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg font-semibold text-sm">
                                    Disponíveis: {leitosDisponiveis}/{totalLeitos}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. CONTEÚDO PRINCIPAL (COM ABAS) */}
                    <div className="bg-PureWhite rounded-xl shadow-sm border border-LightGrey overflow-hidden">
                        
                        {/* Navegação de Abas */}
                        <div className="flex border-b border-LightGrey px-6 pt-2">
                            <button
                                onClick={() => setActiveTab('Leitos')}
                                className={`
                                    py-3 px-4 text-sm font-bold transition-all border-b-2
                                    ${activeTab === 'Leitos' 
                                        ? 'border-Blue3 text-Blue3' 
                                        : 'border-transparent text-Grey hover:text-DarkGrey'
                                    }
                                `}
                            >
                                MAPA DE LEITOS E SALAS
                            </button>
                            <button
                                onClick={() => setActiveTab('Historico')}
                                className={`
                                    py-3 px-4 text-sm font-bold transition-all border-b-2
                                    ${activeTab === 'Historico' 
                                        ? 'border-Blue3 text-Blue3' 
                                        : 'border-transparent text-Grey hover:text-DarkGrey'
                                    }
                                `}
                            >
                                HISTÓRICO DE OCUPAÇÃO
                            </button>
                        </div>

                        {/* Conteúdo da Aba Ativa */}
                        <div className="p-6">
                            
                            {/* ABA 1: MAPA DE LEITOS E SALAS */}
                            {activeTab === 'Leitos' && (
                                <div className="space-y-8">
                                    
                                    {/* Ala de Leitos */}
                                    <div>
                                        <h3 className="text-lg font-bold text-Black mb-4">Alas de Internação</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {filteredAlas.map(ala => (
                                                <button 
                                                    key={ala.nome}
                                                    onClick={() => handleOpenAlaMap(ala)}
                                                    className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-all ${getColorClass(ala.risco)} text-left h-36 flex flex-col justify-between`}
                                                >
                                                    <div>
                                                        <p className="font-bold text-lg mb-1">{ala.nome}</p>
                                                        <p className="text-sm opacity-80">{ala.tipo}</p>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-sm font-medium">Ocup: {ala.ocupados}/{ala.total}</p>
                                                        <span className="text-xs font-bold uppercase tracking-wide bg-white/50 px-2 py-1 rounded">
                                                            {ala.risco}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Legenda Visual */}
                                        <div className="mt-4 flex gap-6 text-xs font-bold text-Grey uppercase tracking-wide">
                                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> Alto Risco</div>
                                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Médio Risco</div>
                                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Baixo Risco</div>
                                        </div>
                                    </div>

                                    {/* Salas de Exames */}
                                    <div>
                                        <h3 className="text-lg font-bold text-Black mb-4 pt-6 border-t border-LightGrey">Salas de Exames e Procedimentos</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {salasExames.map(sala => (
                                                <div 
                                                    key={sala.id || sala.nome}
                                                    className={`p-4 border rounded-lg shadow-sm ${getColorClass(sala.status)} text-left h-36 flex flex-col justify-between`}
                                                >
                                                    <div>
                                                        <p className="font-bold text-lg mb-1">{sala.nome}</p>
                                                        <p className="text-sm opacity-80">{sala.tipo}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Status: {sala.status}</p>
                                                        {sala.liberacao && sala.liberacao !== '-' && (
                                                            <p className="text-xs mt-1">Liberação: {sala.liberacao}</p>
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
                                <div className="rounded-lg border border-LightGrey overflow-hidden">
                                    {/* Cabeçalho da Tabela */}
                                    <div className="grid grid-cols-5 p-4 text-xs font-bold text-Grey uppercase tracking-wide bg-gray-50 border-b border-LightGrey">
                                        <div>Leito</div>
                                        <div>Paciente</div>
                                        <div>Entrada</div>
                                        <div>Saída</div>
                                        <div>Duração</div>
                                    </div>

                                    {/* Linhas da Tabela */}
                                    {historicoOcupacao.map(item => (
                                        <button
                                            key={item.passagemId}
                                            onClick={() => handleOpenDetalhe(item)} 
                                            className="w-full grid grid-cols-5 p-4 text-sm text-left border-b border-LightGrey hover:bg-gray-50 transition items-center last:border-b-0"
                                        >
                                            <div className="font-bold text-Blue3">{item.leitoNome}</div>
                                            <div className="text-Black font-medium">{item.paciente}</div>
                                            <div className="text-DarkGrey">{item.dataOcupacao}</div>
                                            <div className="text-DarkGrey">{item.dataLiberacao}</div>
                                            <div className="font-semibold text-Black">{item.duracao}</div>
                                        </button>
                                    ))}
                                    
                                    {historicoOcupacao.length === 0 && (
                                        <div className="p-8 text-center text-Grey">Nenhum histórico recente encontrado.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

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
                </>
            )}
        </div>
    );
}