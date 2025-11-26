// Arquivo: src/components/Exames/DetalhesExameModal.jsx

export default function DetalhesExameModal({ exame, onClose }) {
    if (!exame) return null;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pronto': return 'bg-green-500';
            case 'Pendente': return 'bg-yellow-500';
            case 'Coletado': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300">
                
                {/* Cabeçalho do Modal */}
                <div className={`p-4 text-white font-bold text-lg flex justify-between items-center ${getStatusClass(exame.status)}`}>
                    <span>Detalhes do Exame: {exame.tipo}</span>
                    <span className="text-sm font-normal">Status: {exame.status}</span>
                </div>
                
                <div className="p-6 space-y-4">
                    
                    {/* Informações Gerais do Exame */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Informações do Paciente e Solicitação</h4>
                        <p className="text-sm"><span className="font-semibold">Paciente:</span> {exame.paciente}</p>
                        <p className="text-sm"><span className="font-semibold">Solicitante:</span> {exame.solicitante}</p>
                        <p className="text-sm"><span className="font-semibold">Data da Solicitação:</span> {exame.dataSolicitacao}</p>
                        <p className="text-sm"><span className="font-semibold">Tipo de Exame:</span> {exame.tipo}</p>
                    </div>

                    {/* Resultados (se estiver pronto) */}
                    {exame.status === 'Pronto' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-800 mb-2 border-b pb-1">Resultado Final</h4>
                            <p className="text-sm"><span className="font-semibold">Data do Resultado:</span> {exame.dataResultado}</p>
                            <p className="text-sm mt-2 whitespace-pre-wrap">{exame.resultadoDetalhes}</p>
                        </div>
                    )}
                    
                    {exame.status !== 'Pronto' && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                            <p className="font-semibold">O Resultado ainda não está disponível.</p>
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