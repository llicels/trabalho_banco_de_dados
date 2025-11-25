const API_URL = 'http://localhost:8000';

export const dashboardService = {
  
  // 1. LEITOS
  getDadosLeitos: async () => {
    try {
      // Busca o total de leitos
      const resTotal = await fetch(`${API_URL}/leitos`);
      const listaLeitos = await resTotal.json();
      
      // Busca as ocupações ativas
      const resOcupados = await fetch(`${API_URL}/leitos/ocupacoes`);
      const listaOcupacoes = await resOcupados.json();

      // --- 1. Calcular Capacidades ---
      const leitos = Array.isArray(listaLeitos) ? listaLeitos : [];
      const totalGeral = leitos.length || 40; 

      // Conta quantos leitos tem a palavra "Emergência" no tipo
      const capEmergencia = leitos.filter(l => l.tipo && l.tipo.toLowerCase().includes('emergência')).length || 10;
      const capObservacao = totalGeral - capEmergencia;

      // --- 2. Calcular Ocupações Ativas ---
      const ocupacoes = Array.isArray(listaOcupacoes) ? listaOcupacoes : [];
      const ocupadosAtivos = ocupacoes.filter(o => !o.data_alta).length;

      // --- 3. Distribuir Ocupação ---
      const ocupadosEmergencia = Math.min(ocupadosAtivos, capEmergencia);
      const ocupadosObservacao = Math.max(0, ocupadosAtivos - ocupadosEmergencia);
      
      // --- VALOR FIXO PARA TESTE ---
      const leitosManutencao = 0; 

      return {
        total: totalGeral,
        ocupados: ocupadosAtivos,
        detalhes: {
          capEmergencia,
          capObservacao,
          ocupadosEmergencia,
          ocupadosObservacao,
          manutencao: leitosManutencao
        }
      };
    } catch (error) {
      console.error("Erro API Leitos:", error);
      return { 
        total: 40, 
        ocupados: 0, 
        detalhes: { capEmergencia: 10, capObservacao: 30, ocupadosEmergencia: 0, ocupadosObservacao: 0, manutencao: 0 } 
      };
    }
  },

  // 2. EQUIPE
  getEquipePlantao: async () => {
    try {
      // --- DATA FIXA PARA TESTE ---
      const dataBusca = '2024-01-01'; 
      
      const response = await fetch(`${API_URL}/turnos/escala/data?data=${dataBusca}`);
      const data = await response.json();
      
      if (!Array.isArray(data)) return { total: 0, medicos: 0, enfermagem: 0, apoio: 0 };

      // 1. Conta Médicos
      const medicos = data.filter(p => 
        p.funcao && (p.funcao.toLowerCase().includes('médico') || 
        p.funcao.toLowerCase().includes('medico'))
      ).length;

      // 2. Conta Enfermagem (Enfermeiros + Técnicos)
      const enfermagem = data.filter(p => 
        p.funcao && (p.funcao.toLowerCase().includes('enfermeiro') || 
        p.funcao.toLowerCase().includes('tecnico'))
      ).length;

      // 3. Conta Apoio
      const apoio = data.filter(p => {
        if (!p.funcao) return false;
        const f = p.funcao.toLowerCase();
        return f.includes('apoio') || 
               f.includes('limpeza') || 
               f.includes('recep') || 
               f.includes('segurança') || 
               f.includes('porteiro') ||
               f.includes('auxiliar');
      }).length;

      const total = medicos + enfermagem + apoio;

      return {
        total,
        medicos,
        enfermagem,
        apoio
      };

    } catch (error) {
      console.error("Erro API Equipe:", error);
      return { total: 0, medicos: 0, enfermagem: 0, apoio: 0 };
    }
  },

  // 3. TRANSFERÊNCIAS
  getTransferenciasAtivas: async () => {
    try {
      const response = await fetch(`${API_URL}/transferencias`);
      const data = await response.json();
      
      if (!Array.isArray(data)) return 0;

      // Conta as que não estão concluídas
      const ativas = data.filter(t => {
        const status = t.status_transferencia || "";
        return status !== 'Concluída' && status !== 'Cancelada';
      }).length;

      return ativas;
    } catch (error) {
      console.error("Erro API Transferências:", error);
      return 0;
    }
  },

  // 4. EXAMES (Simulação de Consulta Geral)
  getExamesPendentes: async () => {
    // SIMULAÇÃO
    return {
      atrasados: 4,
      aguardando: 12,
      lista: [
        { id: 1, tipo: "Hemograma", status: "Atrasado", tempo: "2h" },
        { id: 2, tipo: "Raio-X Tórax", status: "Atrasado", tempo: "4h" },
        { id: 3, tipo: "Urocultura", status: "Atrasado", tempo: "1d" },
        { id: 4, tipo: "Tomografia", status: "Atrasado", tempo: "2d" },
        { id: 5, tipo: "Hemograma", status: "Aguardando", tempo: "15min" },
        { id: 6, tipo: "Raio-X", status: "Aguardando", tempo: "30min" },
        { id: 7, tipo: "Sangue", status: "Aguardando", tempo: "45min" },
        { id: 8, tipo: "Urina", status: "Aguardando", tempo: "1h" }
      ]
    };
  },

  // 5. CONFLITOS
  getConflitosAgenda: async () => {
    try {
      // --- DATA FIXA PARA TESTE ---
      const dataBusca = '2024-01-01';

      const response = await fetch(`${API_URL}/atendimentos/consulta?data_inicio=${dataBusca} 00:00:00&data_fim=${dataBusca} 23:59:59`);
      const data = await response.json();
      
      return {
        total: 0,
        salas: []
      };

    } catch (error) {
      console.error("Erro API Conflitos:", error);
      return { total: 0, salas: [] };
    }
  },

  // 7. PRONTUÁRIOS - Buscar Paciente
  getPacientes: async (cpf) => {
    try {
      // O backend filtra por CPF na rota GET /pacientes
      const response = await fetch(`${API_URL}/pacientes?cpf=${cpf}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);
      return [];
    }
  },

  // 8. PRONTUÁRIOS - Histórico
  getAtendimentosPorPaciente: async (cpf) => {
    try {
      // O backend exige data_inicio e data_fim. Vamos pegar um intervalo gigante.
      const inicio = '1900-01-01';
      const fim = '2100-12-31';
      
      const response = await fetch(`${API_URL}/atendimentos/consulta?cpf_paciente=${cpf}&data_inicio=${inicio}&data_fim=${fim}`);
      const data = await response.json();
      
      if (!Array.isArray(data)) return [];

      // Formata os dados para o frontend
      return data.map(item => ({
        id_atendimento: item.id,
        tipo: item.nivel_risco ? `Classificação: ${item.nivel_risco}` : "Atendimento Geral",
        medico: "Dr(a). Responsável", // O backend retorna CPF, precisaríamos cruzar dados, mas ok por enquanto
        queixa: item.observacoes,
        data_atendimento: new Date(item.data_hora_entrada).toLocaleDateString('pt-BR'),
        hora: new Date(item.data_hora_entrada).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
      }));

    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  },

  // 9. PRONTUÁRIOS - Detalhes (Ao clicar no histórico)
  getDetalhesAtendimento: async (id) => {
    try {
      // Busca os dados principais + exames + medicamentos em paralelo
      const [resPrincipal, resAmostras, resMedicamentos] = await Promise.all([
        fetch(`${API_URL}/atendimentos?id=${id}`),
        fetch(`${API_URL}/atendimentos/${id}/amostras`),
        fetch(`${API_URL}/atendimentos/${id}/medicamentos`)
      ]);

      const principal = (await resPrincipal.json())[0]; // Pega o primeiro da lista
      const amostras = await resAmostras.json();
      const medicamentos = await resMedicamentos.json(); // O backend pode retornar msg de erro se vazio

      return {
        ...principal,
        // Formata exames para a aba "Diagnósticos" e "Exames"
        exames: Array.isArray(amostras) ? amostras.map(a => ({
          nome: a.exame,
          cid: a.tipo, // Usando tipo como "categoria" visual
          resultado: "Aguardando", // Backend não tem campo resultado na tabela amostra
          data: a.previsao_liberacao
        })) : [],
        // Formata medicamentos para a aba "Prescrições"
        medicamentos: Array.isArray(medicamentos) ? medicamentos : [] // Se der erro, manda array vazio
      };

    } catch (error) {
      console.error("Erro detalhes atendimento:", error);
      return {};
    }
  }
};