export default function DetalhesTransferenciaModal({ transferencia, onClose }) {
    if (!transferencia) return null;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Aprovada': return 'bg-green-600';
            case 'Aguardando': return 'bg-yellow-600';
            case 'Rejeitada': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300">
                
                {/* Cabeçalho do Modal */}
                <div className={`p-4 text-white font-bold text-lg flex justify-between items-center ${getStatusClass(transferencia.status)}`}>
                    <span>Detalhes da Transferência</span>
                    <span className="text-sm font-normal">Status: {transferencia.status}</span>
                </div>
                
                <div className ="p-6 space-y-4">
                    
                    {/* 1. Informações Gerais */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Informações do Paciente e Transferência</h4>
                        <p className="text-sm"><span className="font-semibold">Paciente:</span> {transferencia.paciente}</p>
                        <p className="text-sm"><span className="font-semibold">CPF:</span> {transferencia.cpf}</p>
                        <p className="text-sm"><span className="font-semibold">Hospital Destino:</span> {transferencia.hospitalDestino}</p>
                        <p className="text-sm"><span className="font-semibold">Data da Solicitação:</span> {transferencia.dataSolicitacao}</p>
                        <p className="text-sm"><span className="font-semibold">Data da Aprovação/Rejeição:</span> {transferencia.dataAprovacao || 'N/A'}</p>
                    </div>

                    {/* 2. Justificativa */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Justificativa Médica</h4>
                        <p className="text-sm whitespace-pre-wrap">{transferencia.justificativa}</p>
                    </div>

                    {/* 3. Observações da Equipe */}
                    {transferencia.observacoes && (
                        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                            <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Observações</h4>
                            <p className="text-sm">{transferencia.observacoes}</p>
                        </div>
                    )}
                    
                    {/* Botão de Fechar */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}