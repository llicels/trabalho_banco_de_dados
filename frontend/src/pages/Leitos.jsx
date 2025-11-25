import React, { useState } from 'react';
import MapaAlaModal from '../components/leitos/MapaAlaModal';
import DetalhesOcupacaoModal from '../components/leitos/DetalhesOcupacaoModal';
import AtribuirPacienteModal from '../components/leitos/AtribuirPacienteModal';
import MudarStatusModal from '../components/leitos/MudarStatusModal';
import { SearchBar } from '../components/SearchBar'; 


// --- Dados Mockados (completos) ---
const mockLeitosData = [
    { nome: 'E-01', status: 'Ocupado', risco: 'Alto', dataOcupacao: '01/11/2025 10:00', ocupante: { nome: 'João Silva', prontuarioId: 1001 } },
    { nome: 'E-02', status: 'Ocupado', risco: 'Médio', dataOcupacao: '05/11/2025 12:30', ocupante: { nome: 'Ana Lima', prontuarioId: 1002 } },
    { nome: 'E-03', status: 'Livre', risco: 'N/A', dataOcupacao: null, ocupante: null },
    { nome: 'E-04', status: 'Ocupado', risco: 'Alto', dataOcupacao: '20/11/2025 15:00', ocupante: { nome: 'Carlos Dias', prontuarioId: 1003 } },
    { nome: 'E-05', status: 'Livre', risco: 'N/A', dataOcupacao: null, ocupante: null },
    { nome: 'E-06', status: 'Ocupado', risco: 'Baixo', dataOcupacao: '22/11/2025 08:00', ocupante: { nome: 'Maria Clara', prontuarioId: 1004 } },
    { nome: 'E-07', status: 'Ocupado', risco: 'Médio', dataOcupacao: '23/11/2025 18:00', ocupante: { nome: 'Pedro Souza', prontuarioId: 1005 } },
    { nome: 'E-08', status: 'Manutencao', risco: 'N/A', dataOcupacao: null, ocupante: null },
];

const mockAlas = [
    { nome: 'Emergência A', tipo: 'UTI', leitos: mockLeitosData, ocupados: 5, livres: 2, manutencao: 1, total: 8, risco: 'Alto' },
    { nome: 'Internação Geral', tipo: 'Quarto', leitos: mockLeitosData.slice(0, 4), ocupados: 3, livres: 1, manutencao: 0, total: 4, risco: 'Baixo' },
    { nome: 'Observação B', tipo: 'Observação', leitos: mockLeitosData.slice(4), ocupados: 3, livres: 1, manutencao: 0, total: 4, risco: 'Médio' },
];

const mockSalasExames = [
    { nome: 'Sala Raio-X 1', tipo: 'Radiologia', status: 'Ocupado', uso: 'Urgência', liberacao: '14:00' },
    { nome: 'Sala Tomografia', tipo: 'Imagem', status: 'Livre', uso: 'N/A', liberacao: '-' },
    { nome: 'Laboratório Coleta', tipo: 'Laboratório', status: 'Em Uso', uso: 'Coleta', liberacao: '16:00' },
];

const mockHistoricoOcupacao = [
    { passagemId: 501, leitoNome: 'E-01', paciente: 'Joana', dataOcupacao: '01/10/2025 10:00', dataLiberacao: '03/10/2025 18:00', duracao: '2 dias e 8h' },
    { passagemId: 502, leitoNome: 'E-03', paciente: 'Ricardo', dataOcupacao: '04/10/2025 09:00', dataLiberacao: '04/10/2025 19:00', duracao: '10h' },
];

// Contadores totais
const totalLeitos = mockAlas.reduce((acc, ala) => acc + ala.total, 0);
const leitosDisponiveis = mockAlas.reduce((acc, ala) => acc + ala.livres, 0);


export function Leitos() {
    const [selectedAla, setSelectedAla] = useState(null); 
    const [selectedDetalhe, setSelectedDetalhe] = useState(null); 
    const [selectedAtribuicao, setSelectedAtribuicao] = useState(null); 
    const [selectedStatusChange, setSelectedStatusChange] = useState(null); 
    const [activeTab, setActiveTab] = useState('Leitos');

    // Filtros de simulação
    const [tipoFiltro, setTipoFiltro] = useState('Todos');
    const [riscoFiltro, setRiscoFiltro] = useState('Todos');
    const [statusFiltro, setStatusFiltro] = useState('Todos');


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

    const filteredAlas = mockAlas.filter(ala => {
        const tipoMatch = tipoFiltro === 'Todos' || ala.tipo === tipoFiltro;
        const riscoMatch = riscoFiltro === 'Todos' || ala.risco === riscoFiltro;
        
        const statusMatch = statusFiltro === 'Todos' || ala.leitos.some(l => l.status === statusFiltro);

        return tipoMatch && riscoMatch && statusMatch;
    });

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
  
            {/* Contadores */}
            <div className="flex gap-6 mb-6">
                <div className="text-lg font-semibold">Salas Disponíveis: <span className="text-blue-600">{mockAlas.length}/5</span></div>
                <div className="text-lg font-semibold">Leitos Disponíveis: <span className="text-green-600">{leitosDisponiveis}/{totalLeitos}</span></div>
            </div>

            {/* 2. FILTROS E BUSCA (Simulação) */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
                <div className="flex items-start justify-start gap-4 mb-4">
                    
                    {/* Tipo de Sala/Ala */}
                    <div className="w-48 relative pt-4">
                         <label htmlFor="filter-tipo" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Tipo de Sala</label>
                        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                            <option value="Todos">Todos</option>
                            <option value="UTI">UTI</option>
                            <option value="Quarto">Quarto</option>
                            <option value="Observação">Observação</option>
                        </select>
                         <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>

                    {/* Classificação de Risco */}
                    <div className="w-48 relative pt-4">
                        <label htmlFor="filter-risco" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Classificação de Risco</label>
                        <select value={riscoFiltro} onChange={(e) => setRiscoFiltro(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                            <option value="Todos">Todos</option>
                            <option value="Alto">Alto</option>
                            <option value="Médio">Médio</option>
                            <option value="Baixo">Baixo</option>
                        </select>
                        <svg className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>

                    {/* Status */}
                    <div className="w-48 relative pt-4">
                         <label htmlFor="filter-status-leito" className="text-xs font-medium text-gray-500 absolute top-0 left-0">Status</label>
                        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 text-sm cursor-pointer font-medium text-gray-700">
                            <option value="Todos">Todos</option>
                            <option value="Livre">Livre</option>
                            <option value="Ocupado">Ocupado</option>
                            <option value="Manutencao">Manutenção/Limpeza</option>
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
                                {mockSalasExames.map(sala => (
                                    <div 
                                        key={sala.nome}
                                        className={`p-4 border-2 rounded-lg shadow-md ${getColorClass(sala.status)} text-left h-36`}
                                    >
                                        <p className="font-bold text-lg mb-1">{sala.nome}</p>
                                        <p className="text-sm">Tipo: {sala.tipo}</p>
                                        <p className="text-sm">Status: <span className="font-semibold">{sala.status}</span></p>
                                        {sala.status !== 'Livre' && (
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

                            {mockHistoricoOcupacao.map(item => (
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
            
            {/* MODAL 1: MAPA DA ALA */}
            {selectedAla && (
                <MapaAlaModal 
                    ala={selectedAla} 
                    onClose={handleCloseAlaMap} 
                    onLeitoAction={handleLeitoAction} 
                />
            )}
            
            {/* MODAL 2: DETALHES DE LEITO OCUPADO / HISTÓRICO */}
            {selectedDetalhe && (
                <DetalhesOcupacaoModal 
                    leito={selectedDetalhe} 
                    onClose={handleCloseDetalhe} 
                />
            )}
            
            {/* MODAL 3: ATRIBUIR PACIENTE (Leito Livre) */}
            {selectedAtribuicao && (
                <AtribuirPacienteModal
                    leito={selectedAtribuicao}
                    onClose={handleCloseAtribuicao}
                />
            )}

             {/* MODAL 4: MUDAR STATUS (Leito Manutenção) */}
            {selectedStatusChange && (
                <MudarStatusModal
                    leito={selectedStatusChange}
                    onClose={handleCloseStatusChange}
                />
            )}
        </div>
    );
}