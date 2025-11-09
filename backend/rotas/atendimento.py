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

