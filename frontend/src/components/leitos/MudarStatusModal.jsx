export default function MudarStatusModal({ leito, onClose }) {
    
    const handleLiberar = () => {
        alert(`Simulação: Leito ${leito.nome} liberado da manutenção.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="bg-yellow-600 p-4 text-white font-bold text-lg">
                    Liberar Leito {leito.nome}
                </div>
                
                <div className="p-6 space-y-4">
                    
                    <p className="text-sm text-gray-700">O leito está atualmente em MANUTENÇÃO.</p>
                    <p className="text-sm text-gray-600">Confirma que a manutenção/limpeza foi concluída e o leito deve ser marcado como LIVRE?</p>
                    
                    <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                         <button
                            onClick={handleLiberar}
                            className="py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Marcar como Livre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}