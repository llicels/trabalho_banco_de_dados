from flask import Blueprint, jsonify, request
from servicos.sala import SalaDatabase

sala_blueprint = Blueprint("sala", __name__)


@sala_blueprint.route("/salas", methods=["GET"])
def get_salas():
    id_sala = request.args.get("id", "")
    tipo = request.args.get("tipo", "")
    
    id_sala_int = int(id_sala) if id_sala else None
    tipo_str = tipo if tipo else None
    
    return jsonify(SalaDatabase().get_salas(id_sala_int, tipo_str)), 200


@sala_blueprint.route("/salas", methods=["POST"])
def post_sala():
    json = request.get_json()
    tipo = json.get("tipo", "")
    
    registro = SalaDatabase().registra_sala(tipo)
    
    if not registro:
        return jsonify("Não foi possível registrar a sala"), 400
    
    return jsonify("Sala cadastrada com sucesso"), 200


@sala_blueprint.route("/salas-raio-x", methods=["GET"])
def get_salas_raio_x():
    id_sala = request.args.get("id", "")
    
    id_sala_int = int(id_sala) if id_sala else None
    
    return jsonify(SalaDatabase().get_salas_raio_x(id_sala_int)), 200


@sala_blueprint.route("/salas-raio-x", methods=["POST"])
def post_sala_raio_x():
    registro = SalaDatabase().registra_sala_raio_x()
    
    if not registro:
        return jsonify("Não foi possível registrar a sala de raio-x"), 400
    
    return jsonify("Sala de raio-x cadastrada com sucesso"), 200


@sala_blueprint.route("/consultorios", methods=["GET"])
def get_consultorios():
    id_consultorio = request.args.get("id", "")
    tipo = request.args.get("tipo", "")
    
    id_consultorio_int = int(id_consultorio) if id_consultorio else None
    tipo_str = tipo if tipo else None
    
    return jsonify(SalaDatabase().get_consultorios(id_consultorio_int, tipo_str)), 200


@sala_blueprint.route("/consultorios", methods=["POST"])
def post_consultorio():
    json = request.get_json()
    tipo = json.get("tipo", "")
    
    registro = SalaDatabase().registra_consultorio(tipo)
    
    if not registro:
        return jsonify("Não foi possível registrar o consultório"), 400
    
    return jsonify("Consultório cadastrado com sucesso"), 200


@sala_blueprint.route("/consultorios/uso", methods=["POST"])
def post_uso_consultorio():
    json = request.get_json()
    id_consultorio = json.get("id_consultorio", 0)
    id_turno = json.get("id_turno", 0)
    cpf_medico = json.get("cpf_medico", None)
    cpf_dentista = json.get("cpf_dentista", None)
    cpf_assistente_social = json.get("cpf_assistente_social", None)
    
    registro = SalaDatabase().registra_uso_consultorio(
        id_consultorio, id_turno, cpf_medico, cpf_dentista, cpf_assistente_social
    )
    
    if not registro:
        return jsonify("Não foi possível registrar o uso do consultório"), 400
    
    return jsonify("Uso do consultório registrado com sucesso"), 200


@sala_blueprint.route("/consultorios/livres", methods=["GET"])
def consultorios_livres():
    timestamp = request.args.get("timestamp", "")
    if not timestamp:
        return jsonify("Parâmetro 'timestamp' é obrigatório"), 400
    return jsonify(SalaDatabase().consultorios_sem_medicos_em(timestamp)), 200


@sala_blueprint.route("/salas/desocupadas", methods=["GET"])
def salas_desocupadas():
    timestamp = request.args.get("timestamp", "")
    if not timestamp:
        return jsonify("Parâmetro 'timestamp' é obrigatório"), 400
    return jsonify(SalaDatabase().salas_desocupadas_em(timestamp)), 200


@sala_blueprint.route("/salas-raio-x/desocupadas", methods=["GET"])
def salas_raio_x_desocupadas():
    timestamp = request.args.get("timestamp", "")
    if not timestamp:
        return jsonify("Parâmetro 'timestamp' é obrigatório"), 400
    return jsonify(SalaDatabase().salas_raio_x_desocupadas_em(timestamp)), 200

