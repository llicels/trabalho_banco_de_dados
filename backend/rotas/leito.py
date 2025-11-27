from flask import Blueprint, jsonify, request
from servicos.leito import LeitoDatabase

leito_blueprint = Blueprint("leito", __name__)


@leito_blueprint.route("/leitos", methods=["GET"])
def get_leitos():
    id_leito = request.args.get("id", "")
    tipo = request.args.get("tipo", "")
    
    id_leito_int = int(id_leito) if id_leito else None
    tipo_str = tipo if tipo else None
    
    return jsonify(LeitoDatabase().get_leitos(id_leito_int, tipo_str)), 200


@leito_blueprint.route("/leitos", methods=["POST"])
def post_leito():
    json = request.get_json()
    tipo = json.get("tipo", "")
    
    registro = LeitoDatabase().registra_leito(tipo)
    
    if not registro:
        return jsonify("Não foi possível registrar o leito"), 400
    
    return jsonify("Leito cadastrado com sucesso"), 200


@leito_blueprint.route("/leitos/ocupacoes", methods=["GET"])
def get_ocupacoes():
    cpf_paciente = request.args.get("cpf_paciente", "")
    id_leito = request.args.get("id_leito", "")
    
    cpf = cpf_paciente if cpf_paciente else None
    id_leito_int = int(id_leito) if id_leito else None
    
    return jsonify(LeitoDatabase().get_ocupacoes(cpf, id_leito_int)), 200


@leito_blueprint.route("/leitos/ocupacoes", methods=["POST"])
def post_ocupacao():
    json = request.get_json()
    cpf_paciente = json.get("cpf_paciente", "")
    id_leito = json.get("id_leito", 0)
    data_entrada = json.get("data_entrada", "")
    data_alta = json.get("data_alta", None)
    
    registro = LeitoDatabase().registra_ocupacao(cpf_paciente, id_leito, data_entrada, data_alta)
    
    if not registro:
        return jsonify("Não foi possível registrar a ocupação"), 400
    
    return jsonify("Ocupação registrada com sucesso"), 200


@leito_blueprint.route("/leitos/ocupacoes/finalizar", methods=["PUT"])
def finalizar_ocupacao():
    json = request.get_json()
    cpf_paciente = json.get("cpf_paciente", "")
    id_leito = json.get("id_leito", 0)
    data_alta = json.get("data_alta", "")
    
    registro = LeitoDatabase().finaliza_ocupacao(cpf_paciente, id_leito, data_alta)
    
    if not registro:
        return jsonify("Não foi possível finalizar a ocupação"), 400
    
    return jsonify("Ocupação finalizada com sucesso"), 200


@leito_blueprint.route("/leitos/disponiveis", methods=["GET"])
def leitos_disponiveis():
    tipo = request.args.get("tipo", "")
    if not tipo:
        return jsonify("Parâmetro 'tipo' é obrigatório"), 400
    return jsonify(LeitoDatabase().get_leitos_disponiveis_por_tipo(tipo)), 200

