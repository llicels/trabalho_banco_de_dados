from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from servicos.atendimento import AtendimentoDatabase

atendimento_blueprint = Blueprint("atendimento", __name__)


@atendimento_blueprint.route("/atendimentos", methods=["GET"])
def get_atendimentos():
    id_atendimento = request.args.get("id", "")
    cpf_paciente = request.args.get("cpf_paciente", "")
    
    id_atend = int(id_atendimento) if id_atendimento else None
    cpf = cpf_paciente if cpf_paciente else None
    
    return jsonify(AtendimentoDatabase().get_atendimentos(id_atend, cpf)), 200


@atendimento_blueprint.route("/atendimentos", methods=["POST"])
def post_atendimento():
    json = request.get_json()
    data_hora_entrada = json.get("data_hora_entrada", "")
    cid = json.get("cid", "")
    observacoes = json.get("observacoes", "")
    temperatura = json.get("temperatura", 0)
    pressao_arterial = json.get("pressao_arterial", "")
    nivel_risco = json.get("nivel_risco", "")
    frequencia_cardiaca = json.get("frequencia_cardiaca", 0)
    cpf_paciente = json.get("cpf_paciente", "")
    cpf_medico = json.get("cpf_medico", None)
    cpf_dentista = json.get("cpf_dentista", None)
    cpf_assistente_social = json.get("cpf_assistente_social", None)
    cpf_tecnico_radiologia = json.get("cpf_tecnico_radiologia", None)
    cpf_profissional_enfermagem = json.get("cpf_profissional_enfermagem", None)
    data_hora_saida = json.get("data_hora_saida", None)
    
    registro = AtendimentoDatabase().registra_atendimento(
        data_hora_entrada, cid, observacoes, temperatura, pressao_arterial,
        nivel_risco, frequencia_cardiaca, cpf_paciente, cpf_medico, cpf_dentista,
        cpf_assistente_social, cpf_tecnico_radiologia, cpf_profissional_enfermagem, data_hora_saida
    )
    
    if not registro:
        return jsonify("Não foi possível registrar o atendimento"), 400
    
    return jsonify("Atendimento registrado com sucesso"), 200


@atendimento_blueprint.route("/atendimentos/<int:id_atendimento>/finalizar", methods=["PUT"])
def finalizar_atendimento(id_atendimento):
    json = request.get_json()
    data_hora_saida = json.get("data_hora_saida", "")
    
    registro = AtendimentoDatabase().finaliza_atendimento(id_atendimento, data_hora_saida)
    
    if not registro:
        return jsonify("Não foi possível finalizar o atendimento"), 400
    
    return jsonify("Atendimento finalizado com sucesso"), 200


@atendimento_blueprint.route("/atendimentos/<int:id_atendimento>/amostras", methods=["GET"])
def get_amostras_atendimento(id_atendimento):
    return jsonify(AtendimentoDatabase().get_amostras_atendimento(id_atendimento)), 200


@atendimento_blueprint.route("/atendimentos/<int:id_atendimento>/amostras", methods=["POST"])
def post_amostra_atendimento(id_atendimento):
    json = request.get_json()
    tipo = json.get("tipo", "")
    exame = json.get("exame", "")
    previsao_liberacao = json.get("previsao_liberacao", "")
    
    registro = AtendimentoDatabase().registra_amostra(tipo, exame, previsao_liberacao, id_atendimento)
    
    if not registro:
        return jsonify("Não foi possível registrar a amostra"), 400
    
    return jsonify("Amostra registrada com sucesso"), 200


@atendimento_blueprint.route("/atendimentos/<int:id_atendimento>/equipamentos", methods=["POST"])
def post_equipamento_atendimento(id_atendimento):
    json = request.get_json()
    id_equipamento = json.get("id_equipamento", 0)
    
    registro = AtendimentoDatabase().adiciona_equipamento(id_atendimento, id_equipamento)
    
    if not registro:
        return jsonify("Não foi possível adicionar o equipamento"), 400
    
    return jsonify("Equipamento adicionado com sucesso"), 200


@atendimento_blueprint.route("/atendimentos/<int:id_atendimento>/medicamentos", methods=["POST"])
def post_medicamento_atendimento(id_atendimento):
    json = request.get_json()
    nome_medicamento = json.get("nome_medicamento", "")
    
    registro = AtendimentoDatabase().adiciona_medicamento(id_atendimento, nome_medicamento)
    
    if not registro:
        return jsonify("Não foi possível adicionar o medicamento"), 400
    
    return jsonify("Medicamento adicionado com sucesso"), 200

@atendimento_blueprint.route("/atendimentos/consulta", methods=["GET"])
def consultar_atendimentos():
    """
    Consulta atendimentos por período
    Query params:
    - data_inicio: Data inicial (formato: YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS)
    - data_fim: Data final (formato: YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS)
    - cpf_paciente: (opcional) CPF do paciente
    - cpf_profissional: (opcional) CPF do profissional
    """
    data_inicio = request.args.get("data_inicio", "")
    data_fim = request.args.get("data_fim", "")
    cpf_paciente = request.args.get("cpf_paciente", "")
    cpf_profissional = request.args.get("cpf_profissional", "")
    
    # Validação básica
    if not data_inicio or not data_fim:
        return jsonify("Parâmetros 'data_inicio' e 'data_fim' são obrigatórios"), 400
    
    # Converter strings vazias para None
    cpf_p = cpf_paciente if cpf_paciente else None
    cpf_prof = cpf_profissional if cpf_profissional else None
    
    resultado = AtendimentoDatabase().consultar_atendimentos_por_periodo(
        data_inicio, data_fim, cpf_p, cpf_prof
    )
    
    return jsonify(resultado), 200


@atendimento_blueprint.route("/atendimentos/risco", methods=["GET"])
def atendimentos_risco():
    nivel_risco = request.args.get("nivel_risco", "")
    data = request.args.get("data", "")
    if not nivel_risco or not data:
        return jsonify("Parâmetros 'nivel_risco' e 'data' são obrigatórios"), 400
    return jsonify(AtendimentoDatabase().atendimentos_por_risco_e_data(nivel_risco, data)), 200


@atendimento_blueprint.route("/atendimentos/risco/contagem", methods=["GET"])
def contagem_risco():
    nivel_risco = request.args.get("nivel_risco", "")
    data = request.args.get("data", "")
    if not nivel_risco or not data:
        return jsonify("Parâmetros 'nivel_risco' e 'data' são obrigatórios"), 400
    return jsonify(AtendimentoDatabase().contagem_pacientes_por_risco_e_data(nivel_risco, data)), 200


@atendimento_blueprint.route("/atendimentos/profissional", methods=["GET"])
def atendimentos_profissional():
    cpf = request.args.get("cpf", "")
    if not cpf:
        return jsonify("Parâmetro 'cpf' é obrigatório"), 400
    return jsonify(AtendimentoDatabase().atendimentos_por_profissional(cpf)), 200


@atendimento_blueprint.route("/atendimentos/exames-paciente", methods=["GET"])
def exames_paciente():
    cpf = request.args.get("cpf", "")
    data = request.args.get("data", "")
    if not cpf or not data:
        return jsonify("Parâmetros 'cpf' e 'data' são obrigatórios"), 400
    return jsonify(AtendimentoDatabase().exames_medicamentos_raiox_por_paciente_data(cpf, data)), 200


@atendimento_blueprint.route("/atendimentos/exames", methods=["GET"])
def exames_de_paciente():
    cpf = request.args.get("cpf", "")
    if not cpf:
        return jsonify("Parâmetro 'cpf' é obrigatório"), 400
    return jsonify(AtendimentoDatabase().exames_de_paciente(cpf)), 200


@atendimento_blueprint.route("/atendimentos/exames/resumo", methods=["GET"])
def exames_resumo():
    data_inicio = request.args.get("data_inicio", "")
    data_fim = request.args.get("data_fim", "")

    try:
        fim = datetime.fromisoformat(data_fim) if data_fim else datetime.now()
        inicio = datetime.fromisoformat(data_inicio) if data_inicio else fim - timedelta(days=30)
    except ValueError:
        return jsonify("Formato de data inválido. Use YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS"), 400

    inicio_str = inicio.strftime("%Y-%m-%d %H:%M:%S")
    fim_str = fim.strftime("%Y-%m-%d %H:%M:%S")
    return jsonify(AtendimentoDatabase().get_exames_resumo(inicio_str, fim_str)), 200


@atendimento_blueprint.route("/atendimentos/resultados", methods=["GET"])
def resultados_paciente():
    cpf = request.args.get("cpf", "")
    status = request.args.get("status", "")
    if not cpf or not status:
        return jsonify("Parâmetros 'cpf' e 'status' são obrigatórios"), 400
    return jsonify(AtendimentoDatabase().resultados_disponiveis_por_paciente_status(cpf, status)), 200


@atendimento_blueprint.route("/atendimentos/exames/historico", methods=["GET"])
def historico_exames():
    cpf = request.args.get("cpf", "")
    data_inicio = request.args.get("data_inicio", "")
    data_fim = request.args.get("data_fim", "")
    if not cpf or not data_inicio or not data_fim:
        return jsonify("Parâmetros 'cpf', 'data_inicio' e 'data_fim' são obrigatórios"), 400
    return jsonify(AtendimentoDatabase().historico_exames_paciente_periodo(cpf, data_inicio, data_fim)), 200
