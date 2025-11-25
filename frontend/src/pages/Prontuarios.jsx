import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DetalhesAtendimentoModal from '../components/prontuarios/DetalhesAtendimentoModal';
import { SearchBar } from '../components/SearchBar';
import { dashboardService } from '../services/api';

export function Prontuarios() {
    const [searchParams, setSearchParams] = useSearchParams();
    const buscaInicial = searchParams.get('busca') || '';

    const [searchTerm, setSearchTerm] = useState(buscaInicial);
    const [patientFound, setPatientFound] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pacienteData, setPacienteData] = useState(null);
    const [activeTab, setActiveTab] = useState('Historico');
    const [selectedAtendimento, setSelectedAtendimento] = useState(null);

    const tabOptions = [
        { key: 'Historico', label: 'Histórico Clínico' },
        { key: 'Transferencias', label: 'Transferências' },
        { key: 'Exames', label: 'Histórico de Exames' },
    ];

    useEffect(() => {
        if (buscaInicial) {
            handleSearchSubmit(buscaInicial);
        }
    }, [buscaInicial]);

    // ------------------------------
    // 1. BUSCAR PACIENTE NO BACKEND
    // ------------------------------
    const handleSearchSubmit = async (value) => {
        if (!value) return;
        setLoading(true);
        try {
            // 1. Busca Paciente
            const dadosCompletos = await dashboardService.getPacienteCompleto(value);

            if (!dadosCompletos) {
                setPatientFound(false);
                setPacienteData(null);
                return;
            }

            setPacienteData(dadosCompletos);
            setPatientFound(true);
            setActiveTab("Historico");

        } catch (err) {
            console.error("Erro ao buscar:", err);
            setPatientFound(false);
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        if (!pacienteData) return null;

        // 1. ABA HISTÓRICO (Com Sinais Vitais)
        if (activeTab === "Historico") {
            const lista = pacienteData.historico_atendimentos || [];
            if (lista.length === 0) return <div className="p-8 text-center text-Grey italic">Nenhum atendimento registrado.</div>;

            return (
                <div className="space-y-3">
                    {lista.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-LightGrey shadow-sm hover:border-Blue1/50 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-bold text-Blue3 text-lg block">
                                        {item.tipo}
                                    </span>
                                    <span className="text-xs text-Grey uppercase tracking-wide font-bold">
                                        {item.medico}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-Black">{item.data_atendimento}</span>
                                    <span className="text-xs text-Grey">{item.hora}</span>
                                </div>
                            </div>
                            
                            {/* Sinais Vitais (Se existirem) */}
                            {item.sinais && (item.sinais.temp || item.sinais.pressao) && (
                                <div className="flex gap-4 mb-3 mt-2">
                                    {item.sinais.temp && (
                                        <span className="text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100">
                                            Temp: {item.sinais.temp}°C
                                        </span>
                                    )}
                                    {item.sinais.pressao && (
                                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                            PA: {item.sinais.pressao}
                                        </span>
                                    )}
                                    {item.sinais.freq && (
                                        <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
                                            FC: {item.sinais.freq} bpm
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="text-sm text-DarkGrey bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="font-bold text-Black">Observações: </span>
                                {item.queixa || "Sem observações."}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // 2. ABA TRANSFERÊNCIAS (Nova!)
        if (activeTab === "Transferencias") {
            const lista = pacienteData.historico_transferencias || [];
            if (lista.length === 0) return <div className="p-8 text-center text-Grey italic">Nenhuma transferência registrada.</div>;

            return (
                <div className="space-y-3">
                    {lista.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-LightGrey shadow-sm flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-Black">Destino: Hospital ID {item.id_hospital}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                        item.status_transferencia === 'Concluída' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    }`}>
                                        {item.status_transferencia}
                                    </span>
                                </div>
                                <p className="text-sm text-DarkGrey">Motivo: {item.justificativa}</p>
                                <p className="text-xs text-Grey mt-1">Transporte: {item.transporte}</p>
                            </div>
                            <div className="text-right text-sm font-bold text-Blue3">
                                {new Date(item.data_transferencia).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // 3. ABA EXAMES
        if (activeTab === "Exames") {
             const lista = pacienteData.historico_exames || [];
             // Se a lista vier vazia, pode ser que o backend retorne estrutura diferente, 
             // mas o layout está pronto para receber: [{exame: "...", data: "..."}]
             if (lista.length === 0) return <div className="p-8 text-center text-Grey italic">Nenhum exame no histórico.</div>;

             return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lista.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-LightGrey shadow-sm">
                            <p className="font-bold text-Black">{item.exame || "Exame"}</p>
                            <p className="text-sm text-DarkGrey mt-1">Tipo: {item.tipo}</p>
                            <p className="text-xs text-Grey mt-2">Solicitado em: {new Date(item.data_solicitacao || Date.now()).toLocaleDateString('pt-BR')}</p>
                        </div>
                    ))}
                </div>
             );
        }
    };

    // ------------------------------
    // RENDERIZAÇÃO GERAL
    // ------------------------------
    return (
        <div className="p-8 pt-4 bg-LightGrey min-h-full">

            {/* Busca */}
            <div className="mb-6 flex items-center gap-4">
                <SearchBar
                    placeholder="Buscar paciente por nome ou CPF..."
                    onSearch={(val) => setSearchTerm(val)}
                    onSubmit={(val) => handleSearchSubmit(val)}
                    className="w-full"
                    showFilter={false}
                />

                <button
                    onClick={() => handleSearchSubmit(searchTerm)}
                    className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Buscar
                </button>
            </div>

            {loading && <div className="text-center py-12 text-Blue3 font-bold animate-pulse">Carregando Prontuário...</div>}

            {!loading && patientFound && pacienteData && (
                <div className="max-w-5xl mx-auto bg-PureWhite rounded-2xl shadow-lg border border-LightGrey overflow-hidden">
                    
                    {/* Cabeçalho do Paciente */}
                    <div className="bg-gray-50 p-6 border-b border-LightGrey flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-Black mb-1">{pacienteData.nome}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-DarkGrey">
                                <span className="bg-white px-3 py-1 rounded border border-LightGrey font-mono font-bold">CPF: {pacienteData.cpf}</span>
                                <span className="py-1">Nasc: <strong>{pacienteData.data_nascimento}</strong></span>
                            </div>
                            
                            {/* Tags de Alerta */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {pacienteData.alergias.map((a, i) => (
                                    <span key={i} className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                                        {a.alergia}
                                    </span>
                                ))}
                                {pacienteData.condicoes.map((c, i) => (
                                    <span key={i} className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                                        {c.condicao}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Abas */}
                    <div className="flex border-b border-LightGrey bg-white px-6 overflow-x-auto">
                        {tabOptions.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 px-6 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.key ? 'border-Blue1 text-Blue1' : 'border-transparent text-Grey hover:text-Black hover:bg-gray-50'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6 bg-gray-50/30 min-h-[400px]">
                        {renderTabContent()}
                    </div>
                </div>
            )}

            {/* {selectedAtendimento && (
                <DetalhesAtendimentoModal
                    atendimento={selectedAtendimento}
                    onClose={closeAtendimentoDetails}
                />
            )} */}
        </div>
    );
}