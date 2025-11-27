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
        { key: 'Historico', label: 'Histórico de Atendimentos' },
        { key: 'Diagnosticos', label: 'Diagnósticos' },
        { key: 'Prescricoes', label: 'Prescrições' },
        { key: 'Exames', label: 'Exames Realizados' },
    ];

    // Lógica de busca final: acionada ao clicar ou pressionar Enter
    const handleSearchSubmit = async (value) => {
        const query = value.trim();
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
    
    // Certifica-se de que o valor de busca foi atualizado
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Abre o modal de detalhes do atendimento
    const openAtendimentoDetails = (atendimentoId) => {
        const atendimento = prontuario?.historico?.find(at => at.id === atendimentoId);
        setSelectedAtendimento(atendimento || null);
    };

    const closeAtendimentoDetails = () => {
        setSelectedAtendimento(null);
    };

    // --- Renderização da Aba Ativa ---
    const renderTabContent = () => {
        const dataMap = {
            Historico: prontuario?.historico || [],
            Diagnosticos: prontuario?.diagnosticos || [],
            Prescricoes: prontuario?.prescricoes || [],
            Exames: prontuario?.exames || [],
        };
        const data = dataMap[activeTab] || [];

        if (activeTab === 'Historico') {
            if (!data.length) {
                return (
                    <div className="text-sm text-gray-500 text-center">
                        Nenhum atendimento encontrado.
                    </div>
                );
            }
            return (
                <div className="space-y-2">
                    {data.map(item => (
                        <button
                            key={item.id}
                            onClick={() => openAtendimentoDetails(item.id)}
                            className="w-full text-left p-4 bg-white rounded-lg border-b border-gray-100 shadow-sm hover:bg-gray-50 transition grid grid-cols-5 gap-4 items-center"
                        >
                            <div className="col-span-2">
                                <p className="font-semibold text-gray-800">{item.tipo}</p>
                                <p className="text-sm text-gray-500">{item.medico}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Queixa: <span className="font-medium">{item.queixa}</span></p>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                                <p>{item.data}</p>
                                <p>{item.hora}</p>
                            </div>
                        </button>
                    ))}
                </div>
            );
        }

        // Renderização para Diagnósticos, Prescrições e Exames
        if (!data.length) {
            return (
                <div className="text-sm text-gray-500 text-center">
                    Nenhum registro disponível nesta aba.
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.id || item.titulo} className="w-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm grid grid-cols-2">
                        <div>
                            {/* Conteúdo da Linha */}
                            {activeTab === 'Diagnosticos' && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-500">CID: {item.cid}</p>
                                </>
                            )}
                            {activeTab === 'Prescricoes' && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-600">Uso: <span className="text-green-700">{item.uso}</span></p>
                                </>
                            )}
                            {activeTab === 'Exames' && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className={`text-sm ${item.resultado === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>Resultado: {item.resultado}</p>
                                </>
                            )}
                        </div>
                        <div className="text-right text-sm text-gray-700 font-medium pt-1">
                            {item.data}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* 2. BUSCA DO PACIENTE (Componente SearchBar) */}
            <div className="mb-6">
                <SearchBar
                    placeholder="Buscar paciente por nome ou CPF..."
                    // Atualiza o searchTerm enquanto digita
                    onSearch={handleSearchChange} 
                    // Aciona a busca quando Enter é pressionado
                    onSubmit={handleSearchSubmit} 
                    // Ajustes de estilo para a SearchBar
                    className="w-full"
                    showFilter={false} // Não mostra o ícone de filtro lateral se não for usado
                />
            </div>
            
            {/* Botão manual de Busca */}
            <div className="mb-6 flex justify-end">
                 <button onClick={() => handleSearchSubmit(searchTerm)} className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                     Buscar Prontuário
                 </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {loading && (
                <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg text-gray-600 shadow-sm">
                    Buscando prontuário...
                </div>
            )}


            {/* 3. CONTEÚDO DO PRONTUÁRIO */}
            {patientFound && prontuario && (
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                    
                    {/* Dados do Paciente */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <p className="text-lg font-bold text-gray-800">{prontuario.paciente.nome}</p>
                        <p className="text-sm text-gray-600">
                            CPF: <span className="font-medium">{prontuario.paciente.cpf}</span> | 
                            Data de Nascimento: <span className="font-medium">{prontuario.paciente.nascimento}</span>
                        </p>
                        {(prontuario.paciente.condicoes?.length > 0 || prontuario.paciente.alergias?.length > 0) && (
                            <div className="mt-2 text-sm text-gray-600">
                                {prontuario.paciente.condicoes?.length > 0 && (
                                    <p><span className="font-medium">Condições:</span> {prontuario.paciente.condicoes.join(', ')}</p>
                                )}
                                {prontuario.paciente.alergias?.length > 0 && (
                                    <p><span className="font-medium">Alergias:</span> {prontuario.paciente.alergias.join(', ')}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Abas de Navegação */}
                    <div className="flex border-b border-gray-300 mb-6">
                        {tabOptions.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    py-2 px-6 text-sm font-semibold transition -mb-[1px]
                                    ${activeTab === tab.key 
                                        ? 'border-b-4 border-blue-600 text-blue-600 bg-gray-100 rounded-t-lg'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo da Aba */}
                    <div className="min-h-[300px]">
                        {renderTabContent()}
                    </div>
                </div>
            )}
            
            {!loading && !patientFound && searchTerm.length > 0 && !error && (
                <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-xl">
                    Paciente com nome/CPF "{searchTerm}" não encontrado. Por favor, tente novamente.
                </div>
            )}

            {/* MODAL DE DETALHES DO ATENDIMENTO */}
            {selectedAtendimento && (
                <DetalhesAtendimentoModal 
                    atendimento={selectedAtendimento} 
                    onClose={closeAtendimentoDetails} 
                />
            )}
        </div>
    );
}