export default function DetalhesAtendimentoModal({ atendimento, onClose }) {
    if (!atendimento) return null;

    const { tipo, medico, data, hora, detalhes } = atendimento;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300">
                
                {/* Cabeçalho do Modal */}
                <div className="bg-blue-700 p-4 text-white font-bold text-lg flex justify-between items-center">
                    <span>Detalhes do Atendimento</span>
                    <span className="text-sm font-normal">{medico} - {data} {hora}</span>
                </div>
                
                <div className="p-6 space-y-4">
                    
                    {/* 1. Informações Gerais */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Informações Gerais</h4>
                        <p className="text-sm"><span className="font-semibold">Tipo:</span> {tipo}</p>
                        <p className="text-sm"><span className="font-semibold">Data/Hora:</span> {data} {hora}</p>
                        <p className="text-sm"><span className="font-semibold">Médico Responsável:</span> {medico}</p>
                        <p className="text-sm"><span className="font-semibold">Queixa Principal:</span> {detalhes.queixaPrincipal}</p>
                    </div>

                    {/* 2. Diagnóstico */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Diagnóstico</h4>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                            {detalhes.diagnostico.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>

                    {/* 3. Prescrições */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Prescrições</h4>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                            {detalhes.prescricoes.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>

                    {/* 4. Exames Realizados */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Exames Realizados</h4>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                            {detalhes.exames.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>

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