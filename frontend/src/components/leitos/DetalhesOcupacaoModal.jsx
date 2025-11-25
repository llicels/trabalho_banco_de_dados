export default function DetalhesOcupacaoModal({ leito, onClose }) {
    if (!leito) return null; 

    // O leito pode vir da Matriz ou do Histórico 
    const isHistorico = leito.passagemId;
    const ocupante = leito.ocupante || { nome: leito.paciente, prontuarioId: 'N/A', cpf: 'N/A' };
    const leitoNome = leito.leitoNome || leito.nome;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300">
                
                {/* Cabeçalho do Modal */}
                <div className="p-4 text-white font-bold text-lg bg-blue-700">
                    Detalhes {isHistorico ? 'da Passagem' : 'do Leito'} {leitoNome}
                </div>
                
                <div className="p-6 space-y-4">
                    
                    {/* Informações do Paciente */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Paciente</h4>
                        <p className="text-sm"><span className="font-semibold">Nome:</span> {ocupante.nome}</p>
                        <p className="text-sm"><span className="font-semibold">Prontuário ID:</span> {ocupante.prontuarioId}</p>
                        {!isHistorico && (
                            <p className="text-sm"><span className="font-semibold">Risco:</span> {leito.risco}</p>
                        )}
                        <p className="text-sm"><span className="font-semibold">Ocupação:</span> {leito.dataOcupacao}</p>
                    </div>

                    {/* Detalhes do Histórico (se for Histórico ou Leito Ocupado) */}
                    {(isHistorico || leito.status === 'Ocupado') && (
                         <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                            <h4 className="font-bold mb-2 border-b pb-1 text-yellow-900">Detalhes da Movimentação</h4>
                            <p className="text-sm"><span className="font-semibold">Entrada:</span> {leito.dataOcupacao}</p>
                            {leito.dataLiberacao && <p className="text-sm"><span className="font-semibold">Saída:</span> {leito.dataLiberacao}</p>}
                            {leito.duracao && <p className="text-sm"><span className="font-semibold">Permanência:</span> {leito.duracao}</p>}
                        </div>
                    )}

                    {/* Ações */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                         {(leito.status === 'Ocupado' && !isHistorico) && (
                            <button
                                className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Liberar Leito
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}