import React, { useState } from 'react';
import DetalhesAtendimentoModal from '../components/prontuarios/DetalhesAtendimentoModal';
import { SearchBar } from '../components/SearchBar';
import { dashboardService } from '../services/api';

export function Prontuarios() {
    const [searchTerm, setSearchTerm] = useState('');
    const [patientFound, setPatientFound] = useState(false);

    const [paciente, setPaciente] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [prescricoes, setPrescricoes] = useState([]);
    const [exames, setExames] = useState([]);

    const [activeTab, setActiveTab] = useState('Historico');
    const [selectedAtendimento, setSelectedAtendimento] = useState(null);

    const tabOptions = [
        { key: 'Historico', label: 'Histórico de Atendimentos' },
        { key: 'Diagnosticos', label: 'Diagnósticos' },
        { key: 'Prescricoes', label: 'Prescrições' },
        { key: 'Exames', label: 'Exames Realizados' },
    ];

    // ------------------------------
    // 1. BUSCAR PACIENTE NO BACKEND
    // ------------------------------
    const handleSearchSubmit = async (value) => {
        try {
            // 1. Busca Paciente
            const result = await dashboardService.getPacientes(value);

            if (!result || result.length === 0) {
                setPatientFound(false);
                setPaciente(null); // Limpa dados antigos se não achar
                return;
            }

            const dados = result[0];

            setPaciente({
                nome: dados.nome,
                cpf: dados.cpf,
                nascimento: dados.data_nascimento
                // O objeto 'dados' tem tudo que vem do banco
            });

            setPatientFound(true);

            // 2. Busca Histórico
            const atendimentos = await dashboardService.getAtendimentosPorPaciente(dados.cpf);
            setHistorico(atendimentos);

            // Limpa as abas de detalhes (só preenchem quando clica num atendimento específico)
            setDiagnosticos([]);
            setPrescricoes([]);
            setExames([]);

            setActiveTab("Historico");

        } catch (err) {
            console.error("Erro ao buscar paciente:", err);
            setPatientFound(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // ------------------------------
    // 2. DETALHES DO ATENDIMENTO
    // ------------------------------
    const openAtendimentoDetails = async (id) => {
        try {
            const detalhes = await dashboardService.getDetalhesAtendimento(id);
            setSelectedAtendimento(detalhes);

            // Preencher abas derivadas
            setDiagnosticos(
                (detalhes.exames || [])
                    .filter(ex => ex.cid)
                    .map(ex => ({
                        atendimentoId: id,
                        titulo: ex.nome || "Diagnóstico",
                        cid: ex.cid,
                        data: ex.data || ""
                    }))
            );

            setPrescricoes(
                (detalhes.medicamentos || []).map(m => ({
                    atendimentoId: id,
                    titulo: m.nome,
                    uso: m.dosagem,
                    data: m.data_prescricao || ""
                }))
            );

            setExames(
                (detalhes.exames || []).map(ex => ({
                    atendimentoId: id,
                    titulo: ex.nome,
                    resultado: ex.resultado,
                    data: ex.data_exame || ""
                }))
            );

        } catch (e) {
            console.error("Erro ao carregar detalhes do atendimento:", e);
        }
    };

    const closeAtendimentoDetails = () => setSelectedAtendimento(null);

    // ------------------------------
    // 3. RENDERIZAÇÃO DAS ABAS
    // ------------------------------
    const renderTabContent = () => {
        let data = [];

        if (activeTab === "Historico") data = historico;
        if (activeTab === "Diagnosticos") data = diagnosticos;
        if (activeTab === "Prescricoes") data = prescricoes;
        if (activeTab === "Exames") data = exames;

        if (activeTab === "Historico") {
            return (
                <div className="space-y-2">
                    {data.map(item => (
                        <button
                            key={item.id_atendimento || item.id}
                            onClick={() => openAtendimentoDetails(item.id_atendimento || item.id)}
                            className="w-full text-left p-4 bg-white rounded-lg border-b border-gray-100 shadow-sm hover:bg-gray-50 transition grid grid-cols-5 gap-4 items-center"
                        >
                            <div className="col-span-2">
                                <p className="font-semibold text-gray-800">{item.tipo || "Atendimento"}</p>
                                <p className="text-sm text-gray-500">{item.medico || "Profissional não informado"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">
                                    Queixa: <span className="font-medium">{item.queixa || "—"}</span>
                                </p>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                                <p>{item.data_atendimento || item.data}</p>
                                <p>{item.hora || ""}</p>
                            </div>
                        </button>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="w-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm grid grid-cols-2"
                    >
                        <div>
                            {activeTab === "Diagnosticos" && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-500">CID: {item.cid}</p>
                                </>
                            )}

                            {activeTab === "Prescricoes" && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-600">Uso: <span className="text-green-700">{item.uso}</span></p>
                                </>
                            )}

                            {activeTab === "Exames" && (
                                <>
                                    <p className="font-semibold text-gray-800">{item.titulo}</p>
                                    <p className={`text-sm ${item.resultado === "Normal" ? "text-green-600" : "text-red-600"}`}>
                                        Resultado: {item.resultado}
                                    </p>
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

    // ------------------------------
    // RENDERIZAÇÃO GERAL
    // ------------------------------
    return (
        <div className="p-8 pt-4 bg-gray-50 min-h-full">

            {/* Busca */}
            <div className="mb-6 flex items-center gap-4">
                <SearchBar
                    placeholder="Buscar paciente por nome ou CPF..."
                    onSearch={handleSearchChange}
                    onSubmit={handleSearchSubmit}
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

            {/* Conteúdo principal */}
            {patientFound && paciente && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

                    {/* Dados do Paciente */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <p className="text-lg font-bold text-gray-800">{paciente.nome}</p>
                        <p className="text-sm text-gray-600">
                            CPF: <span className="font-medium">{paciente.cpf}</span> |
                            Data de Nascimento: <span className="font-medium">{paciente.nascimento}</span>
                        </p>
                    </div>

                    {/* Abas */}
                    <div className="flex border-b border-gray-300 mb-6">
                        {tabOptions.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    py-2 px-6 text-sm font-semibold transition -mb-[1px]
                                    ${activeTab === tab.key
                                        ? 'border-b-4 border-Blue1 text-Blue1 bg-gray-100 rounded-t-lg'
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

            {!patientFound && searchTerm.length > 0 && (
                <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-xl">
                    Paciente com nome/CPF "{searchTerm}" não encontrado.
                </div>
            )}

            {/* Modal */}
            {selectedAtendimento && (
                <DetalhesAtendimentoModal
                    atendimento={selectedAtendimento}
                    onClose={closeAtendimentoDetails}
                />
            )}
        </div>
    );
}
