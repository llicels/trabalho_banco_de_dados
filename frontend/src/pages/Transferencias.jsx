import React, { useEffect, useMemo, useState } from 'react';
import DetalhesTransferenciaModal from '../components/transferencias/DetalhesTransferenciaModal';
import { SearchBar } from '../components/SearchBar';
import { FilterSelect } from '../components/FilterSelect';
import { transferenciasService } from '../services/api';

const periodoOptions = ["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias"];


export function Transferencias() {

    const [transferencias, setTransferencias] = useState([]);
    const [statusOptions, setStatusOptions] = useState(["Todos"]);
    const [hospitalOptions, setHospitalOptions] = useState(["Todos"]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState("Todos");
    const [selectedHospital, setSelectedHospital] = useState("Todos");
    const [selectedPeriodo, setSelectedPeriodo] = useState(periodoOptions[0]);

    const [selectedTransferencia, setSelectedTransferencia] = useState(null);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setLoading(true);
            setError('');

            try {
                const dados = await transferenciasService.getResumo();
                if (!ativo) return;

                setTransferencias(dados);

                const hospSet = Array.from(new Set(dados.map(t => t.hospitalDestino))).filter(Boolean);
                const statusSet = Array.from(new Set(dados.map(t => t.status))).filter(Boolean);

                setHospitalOptions(["Todos", ...hospSet]);
                setStatusOptions(["Todos", ...statusSet]);

            } catch (err) {
                console.error("Erro ao carregar transferências", err);
                if (ativo) setError("Não foi possível carregar as transferências.");
            } finally {
                if (ativo) setLoading(false);
            }
        }

        carregar();
        return () => { ativo = false };
    }, []);

    const handleSearchChange = (value) => setSearchTerm(value);

    // ---- FILTROS ----
    const filteredTransferencias = useMemo(() => {
        let list = transferencias;

        // Busca por nome ou CPF
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(t =>
                t.paciente.toLowerCase().includes(q) ||
                t.cpf.includes(q)
            );
        }

        // Status
        if (selectedStatus !== "Todos") {
            list = list.filter(t => t.status === selectedStatus);
        }

        // Hospital
        if (selectedHospital !== "Todos") {
            list = list.filter(t => t.hospitalDestino === selectedHospital);
        }

        return list;
    }, [transferencias, searchTerm, selectedStatus, selectedHospital, selectedPeriodo]);

    const aguardandoCount = transferencias.filter(t => t.status === "Aguardando").length;

    const getStatusColor = (status) => {
        switch (status) {
            case "Aprovada": return "text-green-600 font-semibold";
            case "Aguardando": return "text-yellow-600 font-semibold";
            case "Rejeitada": return "text-red-600 font-semibold";
            default: return "text-gray-600";
        }
    };

    const handleOpenTransferenciaDetails = (t) => setSelectedTransferencia(t);
    const handleCloseTransferenciaDetails = () => setSelectedTransferencia(null);


    return (
        <div className="p-8 pt-4 bg-gray-50 min-h-full">

            {/* ===== FILTROS ===== */}
            <div className="bg-white p-6 pt-4 pb-4 rounded-xl shadow-sm border border-gray-200 mb-4">

                <div className="flex flex-col lg:flex-row items-end justify-between gap-6">

                    {/* Dropdowns */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">

                        <FilterSelect
                            label="Status"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            options={statusOptions}
                            className="w-full sm:w-48"
                        />

                        <FilterSelect
                            label="Hospital Destino"
                            value={selectedHospital}
                            onChange={(e) => setSelectedHospital(e.target.value)}
                            options={hospitalOptions}
                            className="w-full sm:w-48"
                        />

                        <FilterSelect
                            label="Período"
                            value={selectedPeriodo}
                            onChange={(e) => setSelectedPeriodo(e.target.value)}
                            options={periodoOptions}
                            className="w-full sm:w-48"
                        />

                    </div>

                    {/* Badge aguardando */}
                    <div className="px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg font-semibold text-sm whitespace-nowrap">
                        Aguardando Transferência: {aguardandoCount}
                    </div>
                </div>

                {/* Campo de Busca */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <SearchBar
                        placeholder="Buscar paciente por nome ou CPF..."
                        onSearch={handleSearchChange}
                        onSubmit={handleSearchChange}
                        className="w-full"
                        showFilter={false}
                    />
                </div>
            </div>

            {/* ===== TABELA ===== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Cabeçalho */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                    <div>Paciente</div>
                    <div>Hospital Destino</div>
                    <div>Status</div>
                    <div>Data Solicitação</div>
                    <div>Justificativa</div>
                </div>

                {/* Linhas */}
                {filteredTransferencias.length > 0 ? (
                    filteredTransferencias.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleOpenTransferenciaDetails(t)}
                            className="w-full grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2.5fr] p-4 text-sm text-left border-b border-gray-100 hover:bg-gray-50 transition items-center"
                        >
                            <div className="font-medium text-gray-900">{t.paciente}</div>
                            <div className="text-gray-700">{t.hospitalDestino}</div>
                            <div className={getStatusColor(t.status)}>{t.status}</div>
                            <div className="text-gray-600">{t.dataSolicitacao}</div>
                            <div className="text-gray-600 truncate">{t.justificativa}</div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma solicitação encontrada com os filtros aplicados.
                    </div>
                )}
            </div>

            {selectedTransferencia && (
                <DetalhesTransferenciaModal
                    transferencia={selectedTransferencia}
                    onClose={handleCloseTransferenciaDetails}
                />
            )}
        </div>
    );
}
