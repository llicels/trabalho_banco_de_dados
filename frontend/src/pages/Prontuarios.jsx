import React, { useState } from 'react';
import DetalhesAtendimentoModal from '../components/prontuarios/DetalhesAtendimentoModal';
import { SearchBar } from '../components/SearchBar'; 


// --- Dados Mockados ---
const mockPatientData = {
    nome: "João da Silva Santos",
    cpf: "123.456.789-00",
    nascimento: "01/01/1975",
};

const mockHistoricoCompleto = [
    { id: 101, tipo: "Atendimento Emergência", medico: "Dr. João Silva", queixa: "Dor no joelho", data: "02/02/2020", hora: "14:30",
        detalhes: { queixaPrincipal: "Dor abdominal forte", diagnostico: ["Gastrite aguda (CID: K29.0)"], prescricoes: ["Omeprazol 20mg - 1x ao dia", "Dieta leve"], exames: ["Hemograma completo - Resultado: Normal", "Ultrassom abdominal - Sem alterações"], }
    },
    { id: 102, tipo: "Atendimento Triagem", medico: "Dr. João Silva", queixa: "Infecção respiratória", data: "05/11/2025", hora: "09:00",
        detalhes: { queixaPrincipal: "Tosse e febre", diagnostico: ["Infecção viral respiratória (CID: J06.9)"], prescricoes: ["Dipirona 500mg - 6/6h se dor"], exames: ["Raio-X Tórax - Resultado: Sem alterações"], }
    },
    { id: 103, tipo: "Atendimento Emergência", medico: "Dr. João Silva", queixa: "Queda", data: "02/02/2020", hora: "14:30",
        detalhes: { queixaPrincipal: "Queda", diagnostico: ["Fratura no braço"], prescricoes: ["Imobilização", "Analgésico"], exames: [], }
    },
    { id: 104, tipo: "Atendimento Emergência", medico: "Dr. João Silva", queixa: "Corte na mão", data: "02/02/2020", hora: "14:30",
        detalhes: { queixaPrincipal: "Corte na mão", diagnostico: ["Lacerção"], prescricoes: ["Sutura", "Antisséptico"], exames: [], }
    },
];

const mockAbasData = {
    Historico: mockHistoricoCompleto, 
    Diagnosticos: [
        { atendimentoId: 101, titulo: "Gastrite aguda", cid: "K29.0", data: "08/11/2025" },
        { atendimentoId: 102, titulo: "Infecção viral respiratória", cid: "J06.9", data: "05/11/2025" },
    ],
    Prescricoes: [
        { atendimentoId: 101, titulo: "Omeprazol 20mg", uso: "1x ao dia - Duração: 14 dias", data: "08/11/2025" },
        { atendimentoId: 102, titulo: "Dipirona 500mg", uso: "6/6h se dor - Duração: 5 dias", data: "05/11/2025" },
    ],
    Exames: [
        { atendimentoId: 101, titulo: "Hemograma completo", resultado: "Normal", data: "08/11/2025" },
        { atendimentoId: 102, titulo: "Raio-X Tórax", resultado: "Sem alterações", data: "05/11/2025" },
    ],
};
// -------------------------------------------------------------------------


export function Prontuarios() {
    const [searchTerm, setSearchTerm] = useState('');
    const [patientFound, setPatientFound] = useState(false);
    const [activeTab, setActiveTab] = useState('Historico');
    const [selectedAtendimento, setSelectedAtendimento] = useState(null); // Estado para o modal

    const tabOptions = [
        { key: 'Historico', label: 'Histórico de Atendimentos' },
        { key: 'Diagnosticos', label: 'Diagnósticos' },
        { key: 'Prescricoes', label: 'Prescrições' },
        { key: 'Exames', label: 'Exames Realizados' },
    ];

    // Lógica de busca final: acionada ao clicar ou pressionar Enter
    const handleSearchSubmit = (value) => {
        const query = value.toLowerCase();
        
        // Simulação de busca: 'joao' ou '123' encontram o paciente
        if (query.includes('joao') || query.includes('123')) {
            setPatientFound(true);
            setActiveTab('Historico');
        } else {
            setPatientFound(false);
        }
    };
    
    // Certifica-se de que o valor de busca foi atualizado
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Abre o modal de detalhes do atendimento
    const openAtendimentoDetails = (atendimentoId) => {
        const atendimento = mockHistoricoCompleto.find(at => at.id === atendimentoId);
        setSelectedAtendimento(atendimento);
    };

    const closeAtendimentoDetails = () => {
        setSelectedAtendimento(null);
    };

    // --- Renderização da Aba Ativa ---
    const renderTabContent = () => {
        const data = mockAbasData[activeTab];

        if (activeTab === 'Historico') {
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
        return (
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.id} className="w-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm grid grid-cols-2">
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
            
            {/* Botão manual de Busca (Se necessário, caso a SearchBar não tenha um botão) */}
            <div className="mb-6 flex justify-end">
                 <button onClick={() => handleSearchSubmit(searchTerm)} className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                     Buscar Prontuário
                 </button>
            </div>


            {/* 3. CONTEÚDO DO PRONTUÁRIO (SÓ VISÍVEL APÓS A BUSCA) */}
            {patientFound && (
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                    
                    {/* Dados do Paciente */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <p className="text-lg font-bold text-gray-800">{mockPatientData.nome}</p>
                        <p className="text-sm text-gray-600">
                            CPF: <span className="font-medium">{mockPatientData.cpf}</span> | 
                            Data de Nascimento: <span className="font-medium">{mockPatientData.nascimento}</span>
                        </p>
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
            
            {!patientFound && searchTerm.length > 0 && (
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