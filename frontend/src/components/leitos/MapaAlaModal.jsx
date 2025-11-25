// Arquivo: src/components/LeitosSalas/MapaAlaModal.jsx

export default function MapaAlaModal({ ala, onLeitoAction, onClose }) {
    if (!ala) return null;

    const LeitoCard = ({ leito }) => {
        let bgColor, textColor, icon, action;
        let actionType = '';

        switch (leito.status) {
            case 'Livre':
                bgColor = 'bg-green-400 hover:bg-green-500';
                textColor = 'text-green-900';
                icon = '✓';
                actionType = 'Atribuir';
                action = () => onLeitoAction(leito, actionType);
                break;
            case 'Ocupado':
                bgColor = 'bg-red-400 hover:bg-red-500';
                textColor = 'text-red-900';
                icon = '●'; 
                actionType = 'Detalhes';
                action = () => onLeitoAction(leito, actionType); // Abre o modal de detalhes do paciente
                break;
            case 'Manutencao':
                bgColor = 'bg-yellow-400 hover:bg-yellow-500';
                textColor = 'text-yellow-900';
                icon = '🛠️';
                actionType = 'MudarStatus';
                action = () => onLeitoAction(leito, actionType); // Abre o modal de mudança de status
                break;
            default:
                bgColor = 'bg-gray-400';
                textColor = 'text-gray-900';
                icon = '';
        }

        return (
            <button
                onClick={action}
                className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition duration-150 ${bgColor} ${textColor} text-center h-28 relative`}
            >
                <span className="font-bold text-lg">{leito.nome}</span>
                <span className="text-sm">{leito.ocupante ? leito.ocupante.nome : leito.status}</span>
                <span className={`text-xl absolute bottom-2 ${leito.status === 'Ocupado' ? 'text-red-700' : ''}`}>{icon}</span>
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300">
                
                {/* Cabeçalho do Modal */}
                <div className="bg-gray-700 p-4 text-white font-bold text-xl">
                    Mapa de Ala: {ala.nome}
                </div>
                
                <div className="p-6">
                    <div className="mb-6 text-gray-700 font-semibold">
                        Total: {ala.leitos.length} leitos | 
                        Disponíveis: {ala.leitos.filter(l => l.status === 'Livre').length} | 
                        Ocupados: {ala.leitos.filter(l => l.status === 'Ocupado').length}
                    </div>

                    {/* Matriz de Leitos na Sala */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {ala.leitos.map(leito => (
                            <LeitoCard key={leito.nome} leito={leito} />
                        ))}
                    </div>

                    {/* Legenda */}
                    <div className="flex justify-start gap-6 mt-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-400 border border-green-700"></span> Livre</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-400 border border-red-700"></span> Ocupado</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 border border-yellow-700"></span> Manutenção/Limpeza</div>
                    </div>
                    
                    {/* Botão de Fechar */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
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