from flask import Blueprint, jsonify, request
from servicos.turno import TurnoDatabase

turno_blueprint = Blueprint("turno", __name__)


@turno_blueprint.route("/turnos", methods=["GET"])
def get_turnos():
    id_turno = request.args.get("id", "")
    
    id_turno_int = int(id_turno) if id_turno else None
    
    return jsonify(TurnoDatabase().get_turnos(id_turno_int)), 200


@turno_blueprint.route("/turnos", methods=["POST"])
def post_turno():
    json = request.get_json()
    dia_semana = json.get("dia_semana", "")
    hora_chegada = json.get("hora_chegada", "")
    hora_saida = json.get("hora_saida", "")
    
    registro = TurnoDatabase().registra_turno(dia_semana, hora_chegada, hora_saida)
    
    if not registro:
        return jsonify("Não foi possível registrar o turno"), 400
    
    return jsonify("Turno registrado com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/medicos", methods=["POST"])
def post_medico_turno(id_turno):
    json = request.get_json()
    cpf_medico = json.get("cpf_medico", "")
    
    registro = TurnoDatabase().adiciona_medico_turno(id_turno, cpf_medico)
    
    if not registro:
        return jsonify("Não foi possível adicionar o médico ao turno"), 400
    
    return jsonify("Médico adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/dentistas", methods=["POST"])
def post_dentista_turno(id_turno):
    json = request.get_json()
    cpf_dentista = json.get("cpf_dentista", "")
    
    registro = TurnoDatabase().adiciona_dentista_turno(id_turno, cpf_dentista)
    
    if not registro:
        return jsonify("Não foi possível adicionar o dentista ao turno"), 400
    
    return jsonify("Dentista adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/assistentes-sociais", methods=["POST"])
def post_assistente_social_turno(id_turno):
    json = request.get_json()
    cpf_assistente_social = json.get("cpf_assistente_social", "")
    
    registro = TurnoDatabase().adiciona_assistente_social_turno(id_turno, cpf_assistente_social)
    
    if not registro:
        return jsonify("Não foi possível adicionar o assistente social ao turno"), 400
    
    return jsonify("Assistente social adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/profissionais-enfermagem", methods=["POST"])
def post_profissional_enfermagem_turno(id_turno):
    json = request.get_json()
    cpf_profissional = json.get("cpf_profissional", "")
    
    registro = TurnoDatabase().adiciona_profissional_enfermagem_turno(id_turno, cpf_profissional)
    
    if not registro:
        return jsonify("Não foi possível adicionar o profissional de enfermagem ao turno"), 400
    
    return jsonify("Profissional de enfermagem adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/tecnicos-radiologia", methods=["POST"])
def post_tecnico_radiologia_turno(id_turno):
    json = request.get_json()
    cpf_tecnico = json.get("cpf_tecnico", "")
    
    registro = TurnoDatabase().adiciona_tecnico_radiologia_turno(id_turno, cpf_tecnico)
    
    if not registro:
        return jsonify("Não foi possível adicionar o técnico de radiologia ao turno"), 400
    
    return jsonify("Técnico de radiologia adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/<int:id_turno>/colaboradores-gerais", methods=["POST"])
def post_colaborador_geral_turno(id_turno):
    json = request.get_json()
    cpf_colaborador = json.get("cpf_colaborador", "")
    
    registro = TurnoDatabase().adiciona_colaborador_geral_turno(id_turno, cpf_colaborador)
    
    if not registro:
        return jsonify("Não foi possível adicionar o colaborador geral ao turno"), 400
    
    return jsonify("Colaborador geral adicionado ao turno com sucesso"), 200


@turno_blueprint.route("/turnos/escala/colaborador", methods=["GET"])
def get_escala_colaborador():
    cpf = request.args.get("cpf", "")
    if not cpf:
        return jsonify("Parâmetro 'cpf' é obrigatório"), 400
    return jsonify(TurnoDatabase().get_escala_por_colaborador(cpf)), 200


@turno_blueprint.route("/turnos/escala/data", methods=["GET"])
def get_escala_data():
    data = request.args.get("data", "")
    if not data:
        return jsonify("Parâmetro 'data' é obrigatório"), 400
    return jsonify(TurnoDatabase().get_escala_por_data(data)), 200


@turno_blueprint.route("/turnos/escala/intervalo", methods=["GET"])
def get_escala_intervalo():
    data_inicio = request.args.get("data_inicio", "")
    data_fim = request.args.get("data_fim", "")
    if not data_inicio or not data_fim:
        return jsonify("Parâmetros 'data_inicio' e 'data_fim' são obrigatórios"), 400
    return jsonify(TurnoDatabase().get_escala_por_intervalo(data_inicio, data_fim)), 200


@turno_blueprint.route("/turnos/<int:id_turno>/colaboradores", methods=["GET"])
def get_colaboradores_turno(id_turno):
    return jsonify(TurnoDatabase().get_colaboradores_por_turno(id_turno)), 200

