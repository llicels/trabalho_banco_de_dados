from flask import Blueprint, jsonify, request
from servicos.paciente import PacienteDatabase

paciente_blueprint = Blueprint("paciente", __name__)


@paciente_blueprint.route("/pacientes", methods=["GET"])
def get_pacientes():
    cpf = request.args.get("cpf", "")
    return jsonify(PacienteDatabase().get_pacientes(cpf if cpf else None)), 200


@paciente_blueprint.route("/pacientes", methods=["POST"])
def post_paciente():
    json = request.get_json()
    rg = json.get("rg", "")
    endereco = json.get("endereco", "")
    cpf = json.get("cpf", "")
    data_nascimento = json.get("data_nascimento", "")
    nome = json.get("nome", "")
    telefone = json.get("telefone", "")
    
    registro = PacienteDatabase().registra_paciente(rg, endereco, cpf, data_nascimento, nome, telefone)
    
    if not registro:
        return jsonify("Não foi possível registrar o paciente"), 400
    
    return jsonify("Paciente cadastrado com sucesso"), 200


@paciente_blueprint.route("/pacientes/<cpf>/condicoes", methods=["GET"])
def get_condicoes_paciente(cpf):
    return jsonify(PacienteDatabase().get_condicoes_paciente(cpf)), 200


@paciente_blueprint.route("/pacientes/<cpf>/condicoes", methods=["POST"])
def post_condicao_paciente(cpf):
    json = request.get_json()
    condicao = json.get("condicao", "")
    
    registro = PacienteDatabase().adiciona_condicao(cpf, condicao)
    
    if not registro:
        return jsonify("Não foi possível adicionar a condição"), 400
    
    return jsonify("Condição adicionada com sucesso"), 200


@paciente_blueprint.route("/pacientes/<cpf>/alergias", methods=["GET"])
def get_alergias_paciente(cpf):
    return jsonify(PacienteDatabase().get_alergias_paciente(cpf)), 200


@paciente_blueprint.route("/pacientes/<cpf>/alergias", methods=["POST"])
def post_alergia_paciente(cpf):
    json = request.get_json()
    alergia = json.get("alergia", "")
    
    registro = PacienteDatabase().adiciona_alergia(cpf, alergia)
    
    if not registro:
        return jsonify("Não foi possível adicionar a alergia"), 400
    
    return jsonify("Alergia adicionada com sucesso"), 200

