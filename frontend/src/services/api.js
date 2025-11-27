const API_URL = 'http://localhost:8000';

const httpGet = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Falha ao acessar ${endpoint}`);
  }
  return response.json();
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date) => (date ? date.toLocaleDateString('pt-BR') : '—');

const formatDateTime = (date) =>
  date
    ? date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : '—';

const formatTimeRange = (start, end) => {
  if (!start) return '—';
  const endDate = end || new Date(start.getTime() + 3600000);
  return `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDuration = (start, end) => {
  if (!start || !end) return null;
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const totalHours = Math.floor(diffMs / 3600000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}d ${hours}h`;
  return `${totalHours}h`;
};

const formatCpf = (value = '') => {
  const digits = value.replace(/\D/g, '').padStart(11, '0');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const pickField = (object, ...keys) => {
  for (const key of keys) {
    if (object && object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }
  return null;
};

const buildAgendaEvents = (entries) =>
  safeArray(entries)
    .map((item) => {
      const start = parseDate(pickField(item, 'data_hora_entrada', 'data_hora', 'hora_chegada'));
      const end =
        parseDate(pickField(item, 'data_hora_saida', 'hora_saida')) ||
        (start ? new Date(start.getTime() + 3600000) : null);

      if (!start) return null;

      return {
        id: pickField(item, 'id_atendimento', 'id'),
        day: start.getDate(),
        sala: pickField(item, 'nome_medico', 'nome_dentista', 'nome_colaborador') || 'Sala Geral',
        desc: pickField(item, 'nome_paciente', 'cpf_paciente') || 'Paciente não informado',
        start,
        end,
        hora: formatTimeRange(start, end),
        dateLabel: formatDate(start),
      };
    })
    .filter(Boolean);

const buildAgendaConflicts = (events) => {
  const conflicts = [];
  const grouped = new Map();

  events.forEach((event) => {
    const key = `${event.day}-${event.sala}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(event);
  });

  grouped.forEach((list, key) => {
    if (list.length < 2) return;
    const overlapping = new Map();

    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        const a = list[i];
        const b = list[j];
        if (a.start < b.end && b.start < a.end) {
          overlapping.set(a.id, a);
          overlapping.set(b.id, b);
        }
      }
    }

    if (overlapping.size > 1) {
      const [day, sala] = key.split('-');
      const ordered = Array.from(overlapping.values()).sort((a, b) => a.start - b.start);

      conflicts.push({
        key,
        day: Number(day),
        sala,
        hora: ordered[0].hora,
        date: ordered[0].dateLabel,
        count: ordered.length,
        events: ordered,
      });
    }
  });

  return conflicts.sort((a, b) => a.day - b.day);
};

export const dashboardService = {
  async getDadosLeitos() {
    try {
      const [leitos, ocupacoes] = await Promise.all([
        httpGet('/leitos'),
        httpGet('/leitos/ocupacoes'),
      ]);

      const listaLeitos = safeArray(leitos);
      const listaOcupacoes = safeArray(ocupacoes);

      const totalGeral = listaLeitos.length;
      const capEmergencia = listaLeitos.filter(
        (leito) => (leito.tipo || '').toLowerCase().includes('emerg'),
      ).length;
      const capObservacao = totalGeral - capEmergencia;

      const ocupadosAtivos = listaOcupacoes.filter((ocupacao) => !ocupacao.data_de_alta).length;
      const ocupadosEmergencia = Math.min(ocupadosAtivos, capEmergencia);
      const ocupadosObservacao = Math.max(0, ocupadosAtivos - ocupadosEmergencia);

      return {
        total: totalGeral,
        ocupados: ocupadosAtivos,
        detalhes: {
          capEmergencia,
          capObservacao,
          ocupadosEmergencia,
          ocupadosObservacao,
          manutencao: 0,
        },
      };
    } catch (error) {
      console.error('Erro API Leitos:', error);
      return {
        total: 0,
        ocupados: 0,
        detalhes: {
          capEmergencia: 0,
          capObservacao: 0,
          ocupadosEmergencia: 0,
          ocupadosObservacao: 0,
          manutencao: 0,
        },
      };
    }
  },

  async getEquipePlantao(dataBusca = new Date().toISOString().slice(0, 10)) {
    try {
      const data = await httpGet(`/turnos/escala/data?data=${dataBusca}`);
      const lista = safeArray(data);

      const medicos = lista.filter((p) =>
        (p.funcao || '').toLowerCase().includes('médico') ||
        (p.funcao || '').toLowerCase().includes('medico'),
      ).length;

      const enfermagem = lista.filter((p) => {
        const funcao = (p.funcao || '').toLowerCase();
        return funcao.includes('enfermeiro') || funcao.includes('técnico') || funcao.includes('tecnico');
      }).length;

      const apoio = Math.max(lista.length - medicos - enfermagem, 0);

      if (!lista.length) {
        return sampleEquipePlantao();
      }

      return {
        total: lista.length,
        medicos,
        enfermagem,
        apoio,
      };
    } catch (error) {
      console.error('Erro API Equipe:', error);
      return sampleEquipePlantao();
    }
  },

  async getTransferenciasAtivas() {
    try {
      const lista = await transferenciasService.getResumo();
      return safeArray(lista).filter((item) => {
        const status = (item.status || '').toLowerCase();
        return status !== 'concluída' && status !== 'cancelada';
      }).length;
    } catch (error) {
      console.error('Erro API Transferências:', error);
      return 0;
    }
  },

  async getExamesPendentes() {
    try {
      const exames = await examesService.getResumo(7);
      const atrasados = exames.filter((exame) => exame.status === 'Pendente').length;
      const aguardando = exames.filter((exame) => exame.status !== 'Pronto').length;
      return {
        atrasados,
        aguardando,
        lista: exames.slice(0, 8),
      };
    } catch (error) {
      console.error('Erro API Exames:', error);
      return { atrasados: 0, aguardando: 0, lista: [] };
    }
  },

  async getConflitosAgenda() {
    try {
      const hoje = new Date().toISOString().slice(0, 10);
      const params = new URLSearchParams({
        data_inicio: `${hoje} 00:00:00`,
        data_fim: `${hoje} 23:59:59`,
      });
      const lista = await httpGet(`/atendimentos/consulta?${params.toString()}`);
      const events = buildAgendaEvents(lista);
      const conflicts = buildAgendaConflicts(events);
      if (!conflicts.length) {
        const fallback = sampleConflicts();
        return {
          total: fallback.length,
          salas: fallback.map((conflict) => conflict.sala),
        };
      }
      return {
        total: conflicts.length,
        salas: conflicts.map((conflict) => conflict.sala),
      };
    } catch (error) {
      console.error('Erro API Conflitos:', error);
      const fallback = sampleConflicts();
      return { total: fallback.length, salas: fallback.map((conflict) => conflict.sala) };
    }
  },
};

export const leitosService = {
  async getResumo() {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [leitos, ocupacoes, pacientes, salas, salasLivres] = await Promise.all([
      httpGet('/leitos'),
      httpGet('/leitos/ocupacoes'),
      httpGet('/pacientes'),
      httpGet('/salas'),
      httpGet(`/salas/desocupadas?timestamp=${encodeURIComponent(timestamp)}`),
    ]);

    const pacientesMap = new Map(safeArray(pacientes).map((paciente) => [paciente.cpf, paciente]));
    const ocupacoesOrdenadas = safeArray(ocupacoes).sort(
      (a, b) => new Date(b.data_de_entrada) - new Date(a.data_de_entrada),
    );

    const ocupacaoAtualPorLeito = new Map();
    ocupacoesOrdenadas.forEach((registro) => {
      if (!registro.data_de_alta && !ocupacaoAtualPorLeito.has(registro.id_leito)) {
        ocupacaoAtualPorLeito.set(registro.id_leito, registro);
      }
    });

    const leitosDetalhados = safeArray(leitos).map((leito) => {
      const ocupacao = ocupacaoAtualPorLeito.get(leito.id_leito);
      const paciente = ocupacao ? pacientesMap.get(ocupacao.cpf_paciente) : null;

      return {
        id: leito.id_leito,
        nome: `${leito.tipo === 'Emergência' ? 'E' : 'C'}-${String(leito.id_leito).padStart(2, '0')}`,
        tipo: leito.tipo || 'Comum',
        status: ocupacao ? 'Ocupado' : 'Livre',
        risco: leito.tipo === 'Emergência' ? 'Alto' : 'Médio',
        ocupante: paciente
          ? {
              nome: paciente.nome,
              prontuarioId: paciente.cpf,
              cpf: formatCpf(paciente.cpf),
            }
          : null,
        dataOcupacao: ocupacao ? formatDateTime(parseDate(ocupacao.data_de_entrada)) : null,
        dataLiberacao: ocupacao?.data_de_alta ? formatDateTime(parseDate(ocupacao.data_de_alta)) : null,
      };
    });

    const alasMap = new Map();
    leitosDetalhados.forEach((leito) => {
      if (!alasMap.has(leito.tipo)) alasMap.set(leito.tipo, []);
      alasMap.get(leito.tipo).push(leito);
    });

    const alas = Array.from(alasMap.entries()).map(([tipo, lista]) => {
      const ocupados = lista.filter((leito) => leito.status === 'Ocupado').length;
      const livres = lista.filter((leito) => leito.status === 'Livre').length;
      return {
        nome: tipo === 'Emergência' ? 'Emergência' : 'Internação Geral',
        tipo,
        total: lista.length,
        ocupados,
        livres,
        manutencao: 0,
        risco: tipo === 'Emergência' ? 'Alto' : 'Médio',
        leitos: lista,
      };
    });

    const salasLivresSet = new Set(safeArray(salasLivres).map((sala) => sala.id_sala));
    const salasDetalhadas = safeArray(salas).map((sala) => ({
      id: sala.id_sala,
      nome: `Sala ${sala.id_sala}`,
      tipo: sala.tipo,
      status: salasLivresSet.has(sala.id_sala) ? 'Livre' : 'Em Uso',
      liberacao: salasLivresSet.has(sala.id_sala) ? '-' : 'Em atendimento',
    }));

    const historico = ocupacoesOrdenadas.slice(0, 20).map((registro, index) => {
      const paciente = pacientesMap.get(registro.cpf_paciente);
      const entrada = parseDate(registro.data_de_entrada);
      const alta = parseDate(registro.data_de_alta);

      return {
        passagemId: `${registro.id_leito}-${index}`,
        leitoNome: `Leito ${registro.id_leito}`,
        paciente: paciente?.nome || registro.cpf_paciente,
        dataOcupacao: formatDateTime(entrada),
        dataLiberacao: alta ? formatDateTime(alta) : 'Em aberto',
        duracao: alta ? formatDuration(entrada, alta) : null,
        ocupante: paciente
          ? { nome: paciente.nome, prontuarioId: paciente.cpf, cpf: formatCpf(paciente.cpf) }
          : null,
      };
    });

    return { alas, salas: salasDetalhadas, historico };
  },
};

export const transferenciasService = {
  async getResumo() {
    try {
      const data = await httpGet('/transferencias/resumo');
      return safeArray(data).map(transformTransferenciaRegistro);
    } catch (error) {
      console.warn('Falha ao consultar /transferencias/resumo. Aplicando fallback.', error);
      const fallback = await transferenciasFallback();
      return fallback.length ? fallback : transferenciasSampleData();
    }
  },
};

export const examesService = {
  async getResumo(dias = 7) {
    try {
      const resultado = await fetchExamesResumo(dias);
      return resultado.length ? resultado : examesSampleData();
    } catch (error) {
      console.warn('Falha ao consultar /atendimentos/exames/resumo. Aplicando fallback.', error);
      const fallback = await examesFallback(dias);
      return fallback.length ? fallback : examesSampleData();
    }
  },
};

function transformTransferenciaRegistro(registro) {
  const dataTransferencia = parseDate(registro.data_transferencia);
  const status = registro.status_transferencia || registro.status;
  const nomeHospital = registro.nome_hospital || registro.hospitalDestino;
  const pacienteNome = registro.nome_paciente || registro.paciente;
  return {
    id: registro.id_transferencia || registro.id,
    paciente: pacienteNome || registro.cpf_paciente || 'Paciente não identificado',
    cpf: formatCpf(registro.cpf_paciente || ''),
    hospitalDestino: nomeHospital || (registro.id_hospital ? `Hospital ${registro.id_hospital}` : 'Hospital não informado'),
    status: status || 'Aguardando',
    dataSolicitacao: formatDate(dataTransferencia),
    dataAprovacao: formatDate(dataTransferencia),
    justificativa: registro.justificativa || '',
    observacoes: registro.transporte || registro.observacoes || '',
  };
}

async function fetchExamesResumo(dias) {
  const fim = new Date();
  const inicio = new Date(fim);
  inicio.setDate(fim.getDate() - dias);

  const params = new URLSearchParams({
    data_inicio: inicio.toISOString().slice(0, 19),
    data_fim: fim.toISOString().slice(0, 19),
  });

  const data = await httpGet(`/atendimentos/exames/resumo?${params.toString()}`);
  const agora = new Date();

  return safeArray(data).map((exame) => {
    const previsao = parseDate(exame.previsao_liberacao);
    const dataResultado = parseDate(exame.data_resultado);
    let status = 'Pendente';
    if (dataResultado) {
      status = 'Pronto';
    } else if (previsao && previsao < agora) {
      status = 'Coletado';
    }

    return {
      id: exame.id_amostra,
      paciente: exame.nome_paciente,
      tipo: exame.exame,
      status,
      dataSolicitacao: formatDateTime(parseDate(exame.data_solicitacao)),
      dataResultado: formatDateTime(dataResultado),
      solicitante: exame.solicitante,
      resultadoDetalhes: `Tipo de coleta: ${exame.tipo_coleta || 'Não informado'}`,
    };
  });
}

async function transferenciasFallback() {
  try {
    const transferencias = safeArray(await httpGet('/transferencias'));
    if (!transferencias.length) return [];

    const hospitais = safeArray(await httpGet('/hospitais'));
    const hospitalMap = new Map(
      hospitais.map((hospital) => [hospital.id_hospital || hospital.id, hospital]),
    );

    const atendimentoIds = [...new Set(transferencias.map((t) => t.id_atendimento).filter(Boolean))];
    const atendimentoPairs = await Promise.all(
      atendimentoIds.map(async (id) => {
        try {
          const resultado = await httpGet(`/atendimentos?id=${id}`);
          return [id, safeArray(resultado)[0] || null];
        } catch (error) {
          console.warn(`Falha ao carregar atendimento ${id}`, error);
          return [id, null];
        }
      }),
    );
    const atendimentoMap = new Map(atendimentoPairs);

    const cpfSet = new Set();
    atendimentoMap.forEach((atendimento) => {
      if (atendimento?.cpf_paciente) {
        cpfSet.add(atendimento.cpf_paciente);
      }
    });

    const pacientePairs = await Promise.all(
      [...cpfSet].map(async (cpf) => {
        try {
          const resultado = await httpGet(`/pacientes?cpf=${cpf}`);
          return [cpf, safeArray(resultado)[0] || null];
        } catch (error) {
          console.warn(`Falha ao carregar paciente ${cpf}`, error);
          return [cpf, null];
        }
      }),
    );
    const pacienteMap = new Map(pacientePairs);

    return transferencias.map((registro) => {
      const atendimento = atendimentoMap.get(registro.id_atendimento);
      const paciente = atendimento?.cpf_paciente
        ? pacienteMap.get(atendimento.cpf_paciente)
        : null;
      return transformTransferenciaRegistro({
        id_transferencia: registro.id_transferencia || registro.id,
        data_transferencia: registro.data_transferencia,
        justificativa: registro.justificativa,
        status_transferencia: registro.status_transferencia,
        transporte: registro.transporte,
        id_atendimento: registro.id_atendimento,
        id_hospital: registro.id_hospital,
        nome_hospital: hospitalMap.get(registro.id_hospital)?.nome,
        cpf_paciente: atendimento?.cpf_paciente,
        nome_paciente: paciente?.nome,
      });
    });
  } catch (fallbackError) {
    console.error('Falha no fallback de transferências:', fallbackError);
    return [];
  }
}

async function examesFallback(dias) {
  try {
    const fim = new Date();
    const inicio = new Date(fim);
    inicio.setDate(fim.getDate() - dias);

    const params = new URLSearchParams({
      data_inicio: `${inicio.toISOString().slice(0, 10)} 00:00:00`,
      data_fim: `${fim.toISOString().slice(0, 10)} 23:59:59`,
    });

    const atendimentos = safeArray(await httpGet(`/atendimentos/consulta?${params.toString()}`));
    if (!atendimentos.length) return [];

    const conjuntos = await Promise.all(
      atendimentos.map(async (atendimento) => {
        try {
          const amostras = await httpGet(`/atendimentos/${atendimento.id_atendimento}/amostras`);
          return { atendimento, amostras: safeArray(amostras) };
        } catch (error) {
          console.warn(`Falha ao carregar amostras do atendimento ${atendimento.id_atendimento}`, error);
          return { atendimento, amostras: [] };
        }
      }),
    );

    const agora = new Date();
    const resultados = [];

    conjuntos.forEach(({ atendimento, amostras }) => {
      amostras.forEach((amostra) => {
        const previsao = parseDate(amostra.previsao_liberacao);
        const dataResultado = parseDate(atendimento.data_hora_saida);
        let status = 'Pendente';
        if (dataResultado) {
          status = 'Pronto';
        } else if (previsao && previsao < agora) {
          status = 'Coletado';
        }

        resultados.push({
          id: amostra.id_amostra || `${atendimento.id_atendimento}-${amostra.exame}`,
          paciente: atendimento.nome_paciente || atendimento.cpf_paciente,
          tipo: amostra.exame,
          status,
          dataSolicitacao: formatDateTime(parseDate(atendimento.data_hora_entrada)),
          dataResultado: formatDateTime(dataResultado),
          solicitante:
            atendimento.nome_medico ||
            atendimento.nome_dentista ||
            atendimento.nome_enfermagem ||
            'Profissional UPA',
          resultadoDetalhes: `Tipo de coleta: ${amostra.tipo || 'Não informado'}`,
        });
      });
    });

    return resultados;
  } catch (fallbackError) {
    console.error('Falha no fallback de exames:', fallbackError);
    return [];
  }
}

function sampleEquipePlantao() {
  return {
    total: 12,
    medicos: 4,
    enfermagem: 5,
    apoio: 3,
  };
}

function sampleConflicts() {
  return [
    { key: '3-Sala 3', sala: 'Sala 3', hora: '10h–11h', day: 3, date: '03/01', count: 2, events: [] },
    { key: '15-Sala 1', sala: 'Sala 1', hora: '09h–10h', day: 15, date: '15/01', count: 2, events: [] },
  ];
}

function transferenciasSampleData() {
  return [
    {
      id: 'sample-1',
      paciente: 'Pedro Alves',
      cpf: formatCpf('12312312311'),
      hospitalDestino: 'Hospital Central',
      status: 'Aguardando',
      dataSolicitacao: '24/11/2025',
      dataAprovacao: '—',
      justificativa: 'Requer leito de UTI nível 3.',
      observacoes: 'Aguardando confirmação de vaga.',
    },
    {
      id: 'sample-2',
      paciente: 'Joana Lima',
      cpf: formatCpf('45645645644'),
      hospitalDestino: 'Hospital Regional Sul',
      status: 'Aprovada',
      dataSolicitacao: '20/11/2025',
      dataAprovacao: '21/11/2025',
      justificativa: 'Cirurgia especializada.',
      observacoes: 'Transporte agendado para 16h.',
    },
  ];
}

function examesSampleData() {
  return [
    {
      id: 'sample-exame-1',
      paciente: 'João da Silva',
      tipo: 'Hemograma',
      status: 'Pronto',
      dataSolicitacao: '20/11/2025 08:00',
      dataResultado: '24/11/2025 10:00',
      solicitante: 'Dr. André',
      resultadoDetalhes: 'Leucócitos: 8.5 (Normal). Hemoglobina: 14.2 (Normal).',
    },
    {
      id: 'sample-exame-2',
      paciente: 'Maria Souza',
      tipo: 'Raio-X Tórax',
      status: 'Pendente',
      dataSolicitacao: '23/11/2025 14:30',
      dataResultado: '—',
      solicitante: 'Dra. Laura',
      resultadoDetalhes: 'Aguardando laudo.',
    },
    {
      id: 'sample-exame-3',
      paciente: 'Carlos Nunes',
      tipo: 'Eletrocardiograma',
      status: 'Coletado',
      dataSolicitacao: '24/11/2025 09:10',
      dataResultado: '—',
      solicitante: 'Dr. André',
      resultadoDetalhes: 'Em análise pela cardiologia.',
    },
  ];
}

export const agendaService = {
  async getEventosDoMes(year, monthIndex) {
    const inicio = new Date(year, monthIndex, 1);
    const fim = new Date(year, monthIndex + 1, 0);

    const params = new URLSearchParams({
      data_inicio: `${inicio.toISOString().slice(0, 10)} 00:00:00`,
      data_fim: `${fim.toISOString().slice(0, 10)} 23:59:59`,
    });

    const lista = await httpGet(`/atendimentos/consulta?${params.toString()}`);
    const events = buildAgendaEvents(lista);
    const conflicts = buildAgendaConflicts(events);
    return { events, conflicts };
  },
};

export const prontuarioService = {
  async buscarProntuario(termo) {
    const query = termo.trim();
    if (!query) return null;

    const digits = query.replace(/\D/g, '');
    let paciente = null;

    if (digits.length === 11) {
      const data = await httpGet(`/pacientes?cpf=${digits}`);
      paciente = safeArray(data)[0] || null;
    }

    if (!paciente) {
      const pacientes = await httpGet('/pacientes');
      paciente = safeArray(pacientes).find((p) =>
        (p.nome || '').toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (!paciente) return null;

    const [condicoes, alergias, atendimentos] = await Promise.all([
      httpGet(`/pacientes/${paciente.cpf}/condicoes`),
      httpGet(`/pacientes/${paciente.cpf}/alergias`),
      httpGet(`/atendimentos?cpf_paciente=${paciente.cpf}`),
    ]);

    const historico = await Promise.all(
      safeArray(atendimentos).map(async (atendimento) => {
        const amostras = await httpGet(`/atendimentos/${atendimento.id_atendimento}/amostras`);
        const entrada = parseDate(atendimento.data_hora_entrada);
        const exames = safeArray(amostras).map(
          (amostra) => `${amostra.exame} • Liberação: ${formatDateTime(parseDate(amostra.previsao_liberacao))}`,
        );

        return {
          id: atendimento.id_atendimento,
          tipo: atendimento.nivel_de_risco || 'Atendimento',
          medico:
            pickField(
              atendimento,
              'nome_medico',
              'cpf_medico',
              'nome_dentista',
              'cpf_profissional_enfermagem',
            ) || 'Equipe UPA',
          queixa: atendimento.cid || atendimento.observacoes || '—',
          data: formatDate(entrada),
          hora: entrada
            ? entrada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '',
          detalhes: {
            queixaPrincipal: atendimento.observacoes || '—',
            diagnostico: [atendimento.cid || 'Sem CID informado'],
            prescricoes: [
              atendimento.pressao_arterial
                ? `Pressão arterial: ${atendimento.pressao_arterial}`
                : 'Prescrição não registrada',
            ],
            exames,
          },
        };
      }),
    );

    const diagnosticos = historico.map((item) => ({
      id: item.id,
      titulo: item.detalhes.diagnostico[0],
      cid: item.detalhes.diagnostico[0],
      data: item.data,
    }));

    const prescricoes = historico.map((item) => ({
      id: item.id,
      titulo: item.detalhes.prescricoes[0],
      uso: item.detalhes.prescricoes[0],
      data: item.data,
    }));

    const exames = historico.flatMap((item) =>
      item.detalhes.exames.map((exame, index) => ({
        id: `${item.id}-${index}`,
        titulo: exame,
        resultado: exame.includes('Liberação') ? 'Em análise' : '—',
        data: item.data,
      })),
    );

    return {
      paciente: {
        nome: paciente.nome,
        cpf: formatCpf(paciente.cpf),
        nascimento: formatDate(parseDate(paciente.data_de_nascimento)),
        condicoes: safeArray(condicoes).map((condicao) => condicao.condicoes),
        alergias: safeArray(alergias).map((alergia) => alergia.alergias),
      },
      historico,
      diagnosticos,
      prescricoes,
      exames,
    };
  },
};

export const turnosService = {
  async getEscalaPorData(dataIso) {
    return httpGet(`/turnos/escala/data?data=${dataIso}`);
  },
};
