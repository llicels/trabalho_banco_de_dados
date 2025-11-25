import React, { useState } from 'react'; 

export default function AtribuirPacienteModal({ leito, onClose }) {
    const [pacienteSearch, setPacienteSearch] = useState('');
    const [risco, setRisco] = useState('Médio');
    
    // Simulação de pacientes para atribuição
    const mockPacientesDisponiveis = [
        { id: 701, nome: 'Ricardo Gama', prontuarioId: 2021, cpf: '111.111.111-11' },
        { id: 702, nome: 'Luiza Melo', prontuarioId: 2022, cpf: '222.222.222-22' },
    ];

    const handleAtribuir = () => {
        if (!pacienteSearch) {
            console.error("Por favor, selecione ou procure por um paciente.");
            return;
        }
        alert(`Simulação: Atribuindo ${pacienteSearch} ao leito ${leito.nome} com risco ${risco}.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-green-600 p-4 text-white font-bold text-lg">
                    Atribuir Paciente ao Leito {leito.nome}
                </div>
                
                <div className="p-6 space-y-4">
                    
                    <p className="text-sm text-gray-700">O leito está LIVRE e pronto para uso.</p>

                    {/* Busca de Paciente */}
                    <div>
                        <label className="font-semibold text-gray-700 block mb-1">Buscar Paciente (Nome/CPF)</label>
                        <select 
                            value={pacienteSearch} 
                            onChange={(e) => setPacienteSearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">-- Selecione ou procure por um paciente --</option>
                            {mockPacientesDisponiveis.map(p => (
                                <option key={p.id} value={p.nome}>{p.nome} (CPF: {p.cpf})</option>
                            ))}
                        </select>
                    </div>

                    {/* Risco */}
                    <div>
                        <label className="font-semibold text-gray-700 block mb-1">Classificação de Risco</label>
                        <select 
                            value={risco} 
                            onChange={(e) => setRisco(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="Alto">Alto</option>
                            <option value="Médio">Médio</option>
                            <option value="Baixo">Baixo</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                         <button
                            onClick={handleAtribuir}
                            className="py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Confirmar Atribuição
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}