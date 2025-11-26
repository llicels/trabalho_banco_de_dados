import React, { useState } from 'react';
import DetalhesAtendimentoModal from '../components/prontuarios/DetalhesAtendimentoModal';
import { SearchBar } from '../components/SearchBar';
import { prontuarioService } from '../services/api';

export function Prontuarios() {
    const [prontuario, setProntuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [patientFound, setPatientFound] = useState(false);
    const [activeTab, setActiveTab] = useState('Historico');
    const [selectedAtendimento, setSelectedAtendimento] = useState(null);

    const tabOptions = [
        { key: 'Historico', label: 'Histórico Clínico' },
        { key: 'Diagnosticos', label: 'Diagnósticos' },
        { key: 'Prescricoes', label: 'Prescrições' },
        { key: 'Exames', label: 'Histórico de Exames' },
    ];

    const handleSearchSubmit = async (value) => {
        const query = value?.trim();
        setSearchTerm(query);
        
        if (!query) {
            setProntuario(null);
            setPatientFound(false);
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const resultado = await prontuarioService.buscarProntuario(query);
            if (resultado) {
                setProntuario(resultado);
                setPatientFound(true);
                setActiveTab('Historico');
                setSelectedAtendimento(null);
            } else {
                setProntuario(null);
                setPatientFound(false);
                setError(`Paciente com "${query}" não encontrado.`);
            }
        } catch (err) {
            console.error('Erro ao buscar prontuário', err);
            setProntuario(null);
            setPatientFound(false);
            setError('Não foi possível buscar o prontuário.');
        } finally {
            setLoading(false);
        }
    };

    const openAtendimentoDetails = (atendimentoId) => {
        const atendimento = prontuario?.historico?.find(at => at.id === atendimentoId);
        setSelectedAtendimento(atendimento || null);
    };

    const closeAtendimentoDetails = () => {
        setSelectedAtendimento(null);
    };

    // --- Renderização do Conteúdo das Abas ---
    const renderTabContent = () => {
        if (!prontuario) return null;

        const dataMap = {
            Historico: prontuario.historico || [],
            Diagnosticos: prontuario.diagnosticos || [],
            Prescricoes: prontuario.prescricoes || [],
            Exames: prontuario.exames || [],
        };
        const data = dataMap[activeTab] || [];

        if (!data.length) {
            return <div className="p-8 text-center text-gray-400 italic">Nenhum registro encontrado nesta seção.</div>;
        }

        // 1. ABA HISTÓRICO
        if (activeTab === 'Historico') {
            return (
                <div className="space-y-3">
                    {data.map((item, i) => (
                        <div 
                            key={item.id || i} 
                            onClick={() => openAtendimentoDetails(item.id)}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-bold text-blue-900 text-lg block group-hover:text-blue-700 transition-colors">
                                        {item.tipo}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">
                                        {item.medico}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-800">{item.data}</span>
                                    <span className="text-xs text-gray-500">{item.hora}</span>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                <span className="font-bold text-gray-800">Queixa: </span>
                                {item.queixa || "Sem observações."}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // 2. ABA EXAMES
        if (activeTab === 'Exames') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((item, i) => (
                        <div key={item.id || i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{item.titulo}</p>
                                    <p className={`text-sm font-semibold mt-1 ${item.resultado === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
                                        Resultado: {item.resultado}
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                    {item.data}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // 3. DIAGNÓSTICOS E PRESCRIÇÕES
        return (
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={item.id || i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 text-lg">{item.titulo}</p>
                            
                            {activeTab === 'Diagnosticos' && (
                                <span className="inline-block mt-2 text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                                    CID: {item.cid}
                                </span>
                            )}
                            
                            {activeTab === 'Prescricoes' && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Uso: <span className="font-medium text-green-700">{item.uso}</span>
                                </p>
                            )}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {item.data}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // --- Renderização Principal ---
    return (
        <div className="p-8 pt-4 bg-gray-100 min-h-screen">
            
            {/* 1. BARRA DE BUSCA E BOTÃO */}
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                <SearchBar
                    placeholder="Buscar paciente por nome ou CPF..."
                    onSearch={(val) => setSearchTerm(val)}
                    onSubmit={(val) => handleSearchSubmit(val)}
                    className="w-full"
                    showFilter={false}
                />
                <button
                    onClick={() => handleSearchSubmit(searchTerm)}
                    className="w-full md:w-auto py-2 px-8 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
                >
                    Buscar Paciente
                </button>
            </div>

            {/* MENSAGENS DE ESTADO */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}
            
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-2 text-blue-800 font-bold">Carregando Prontuário...</p>
                </div>
            )}

            {/* 2. CONTEÚDO PRINCIPAL */}
            {!loading && patientFound && prontuario && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    
                    {/* CABEÇALHO DO PACIENTE */}
                    <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{prontuario.paciente.nome}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="bg-white px-3 py-1 rounded border border-gray-200 font-mono font-bold text-gray-700">
                                    CPF: {prontuario.paciente.cpf}
                                </span>
                                <span className="py-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Nasc: <strong>{prontuario.paciente.nascimento}</strong>
                                </span>
                            </div>

                            {/* Tags de Alerta (Condições e Alergias) */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {prontuario.paciente.alergias?.map((alergia, i) => (
                                    <span key={i} className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                                        Allergia: {alergia}
                                    </span>
                                ))}
                                {prontuario.paciente.condicoes?.map((condicao, i) => (
                                    <span key={i} className="text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
                                        {condicao}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BARRA DE ABAS */}
                    <div className="flex border-b border-gray-200 bg-white px-6 overflow-x-auto scrollbar-hide">
                        {tabOptions.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    py-4 px-6 text-sm font-bold transition-all border-b-2 whitespace-nowrap
                                    ${activeTab === tab.key 
                                        ? 'border-blue-600 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* CONTEÚDO DA ABA SELECIONADA */}
                    <div className="p-6 bg-gray-50/50 min-h-[400px]">
                        {renderTabContent()}
                    </div>
                </div>
            )}

            {/* MODAL */}
            {selectedAtendimento && (
                <DetalhesAtendimentoModal
                    atendimento={selectedAtendimento}
                    onClose={closeAtendimentoDetails}
                />
            )}
        </div>
    );
}