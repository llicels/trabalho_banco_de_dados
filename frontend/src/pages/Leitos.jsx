import React, { useEffect, useMemo, useState } from 'react';
import MapaAlaModal from '../components/leitos/MapaAlaModal';
import DetalhesOcupacaoModal from '../components/leitos/DetalhesOcupacaoModal';
import AtribuirPacienteModal from '../components/leitos/AtribuirPacienteModal';
import MudarStatusModal from '../components/leitos/MudarStatusModal';
import { SearchBar } from '../components/SearchBar'; 
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

    // Função auxiliar para cores de status/risco
    const getColorClass = (statusOrRisco) => {
        switch (statusOrRisco) {
            case 'Livre':
            case 'Baixo':
                return 'bg-green-400 text-green-900 border-green-600';
            case 'Ocupado':
            case 'Alto':
                return 'bg-red-400 text-red-900 border-red-600';
            case 'Manutencao':
            case 'Médio':
                return 'bg-yellow-400 text-yellow-900 border-yellow-600';
            default:
                return 'bg-gray-200 text-gray-800 border-gray-400';
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
                    Carregando dados em tempo real...
                </div>
            ) : (
                <>
                    {/* Contadores */}
                    <div className="flex gap-6 mb-6">
                        <div className="text-lg font-semibold">Alas Monitoradas: <span className="text-blue-600">{alas.length}</span></div>
                        <div className="text-lg font-semibold">Leitos Disponíveis: <span className="text-green-600">{leitosDisponiveis}/{totalLeitos}</span></div>
                    </div>

                    {/* 2. FILTROS */}
                    <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
                        <div className="flex items-start justify-start gap-4 mb-4">
                    
                            {/* Tipo de Sala/Ala */}
                            <div className="w-48 relative pt-4">
                                <label htmlFor="filter-tipo" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Tipo de Sala</label>
                                <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                                    {tipoOptions.map((tipo) => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                                <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </div>

                    {/* Classificação de Risco */}
                    <div className="w-48 relative pt-4">
                        <label htmlFor="filter-risco" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Classificação de Risco</label>
                        <select value={riscoFiltro} onChange={(e) => setRiscoFiltro(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                            {riscoOptions.map((risco) => (
                                <option key={risco} value={risco}>{risco}</option>
                            ))}
                        </select>
                        <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>

                    {/* Status */}
                    <div className="w-48 relative pt-4">
                         <label htmlFor="filter-status-leito" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Status</label>
                        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>

            {/* 3. ABAS DE NAVEGAÇÃO */}
            <div className="flex border-b border-gray-300 mb-6">
                <button
                    onClick={() => setActiveTab('Leitos')}
                    className={`py-2 px-6 text-sm font-semibold transition -mb-[1px] ${activeTab === 'Leitos' ? 'border-b-4 border-blue-600 text-blue-600 bg-gray-100 rounded-t-lg' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Mapa de Leitos e Salas
                </button>
                <button
                    onClick={() => setActiveTab('Historico')}
                    className={`py-2 px-6 text-sm font-semibold transition -mb-[1px] ${activeTab === 'Historico' ? 'border-b-4 border-blue-600 text-blue-600 bg-gray-100 rounded-t-lg' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Histórico de Ocupação
                </button>
            </div>


            {/* CONTEÚDO DA ABA ATIVA */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                
                {/* ABA 1: MAPA DE LEITOS E SALAS */}
                {activeTab === 'Leitos' && (
                    <div className="space-y-8">
                        
                        {/* MAPA DA ALA DE LEITOS */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Mapa da Ala de Leitos</h3>
                            <div className="grid grid-cols-5 gap-4">
                                {filteredAlas.map(ala => (
                                    <button 
                                        key={ala.nome}
                                        onClick={() => handleOpenAlaMap(ala)}
                                        className={`p-4 border-2 rounded-lg shadow-md hover:shadow-lg transition ${getColorClass(ala.risco)} text-left h-36`}
                                    >
                                        <p className="font-bold text-lg mb-1">{ala.nome}</p>
                                        <p className="text-sm">Tipo: {ala.tipo}</p>
                                        <p className="text-sm">Ocupação: {ala.ocupados}/{ala.total}</p>
                                        <p className="text-sm">Risco: <span className="font-semibold">{ala.risco}</span></p>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 flex gap-4 text-sm font-medium text-gray-700">
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-400"></span> Ocupado (Alto Risco)</div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400"></span> Ocupado (Médio Risco)</div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-400"></span> Livre (Baixo Risco)</div>
                            </div>
                        </div>

                        {/* STATUS DAS SALAS DE EXAMES */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 border-t pt-4 mt-6">Status das Salas de Exames</h3>
                            <div className="grid grid-cols-5 gap-4">
                                {salasExames.map(sala => (
                                    <div 
                                        key={sala.id || sala.nome}
                                        className={`p-4 border-2 rounded-lg shadow-md ${getColorClass(sala.status)} text-left h-36`}
                                    >
                                        <p className="font-bold text-lg mb-1">{sala.nome}</p>
                                        <p className="text-sm">Tipo: {sala.tipo}</p>
                                        <p className="text-sm">Status: <span className="font-semibold">{sala.status}</span></p>
                                        {sala.liberacao && sala.liberacao !== '-' && (
                                            <p className="text-sm">Liberação: {sala.liberacao}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* ABA 2: HISTÓRICO DE OCUPAÇÃO */}
                {activeTab === 'Historico' && (
                    <div className="space-y-4">
                        
                        {/* Tabela de Histórico */}
                        <div className="mt-6">
                            <div className="grid grid-cols-5 p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                                <div>Leito</div>
                                <div>Paciente</div>
                                <div>Entrada</div>
                                <div>Saída</div>
                                <div>Duração</div>
                            </div>

                            {historicoOcupacao.map(item => (
                                <button
                                    key={item.passagemId}
                                    onClick={() => handleOpenDetalhe(item)} 
                                    className="w-full grid grid-cols-5 p-4 text-sm text-left border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <div className="font-medium text-blue-600">{item.leitoNome}</div>
                                    <div className="text-gray-700">{item.paciente}</div>
                                    <div className="text-gray-600">{item.dataOcupacao}</div>
                                    <div className="text-gray-600">{item.dataLiberacao}</div>
                                    <div className="font-semibold text-gray-800">{item.duracao}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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