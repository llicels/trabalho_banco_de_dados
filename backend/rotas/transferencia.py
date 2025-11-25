from flask import Blueprint, jsonify, request
from servicos.transferencia import TransferenciaDatabase

transferencia_blueprint = Blueprint("transferencia", __name__)


@transferencia_blueprint.route("/transferencias", methods=["GET"])
def get_transferencias():
    id_transferencia = request.args.get("id", "")
    id_atendimento = request.args.get("id_atendimento", "")
    id_hospital = request.args.get("id_hospital", "")
    
    id_transferencia_int = int(id_transferencia) if id_transferencia else None
    id_atendimento_int = int(id_atendimento) if id_atendimento else None
    id_hospital_int = int(id_hospital) if id_hospital else None
    
    return jsonify(TransferenciaDatabase().get_transferencias(id_transferencia_int, id_atendimento_int, id_hospital_int)), 200


@transferencia_blueprint.route("/transferencias", methods=["POST"])
def post_transferencia():
    json = request.get_json()
    data_transferencia = json.get("data_transferencia", "")
    justificativa = json.get("justificativa", "")
    status_transferencia = json.get("status_transferencia", "")
    transporte = json.get("transporte", "")
    id_atendimento = json.get("id_atendimento", 0)
    id_hospital = json.get("id_hospital", 0)
    
    registro = TransferenciaDatabase().registra_transferencia(
        data_transferencia, justificativa, status_transferencia, transporte, id_atendimento, id_hospital
    )
    
    if not registro:
        return jsonify("Não foi possível registrar a transferência"), 400
    
    return jsonify("Transferência registrada com sucesso"), 200


@transferencia_blueprint.route("/hospitais", methods=["GET"])
def get_hospitais():
    id_hospital = request.args.get("id", "")
    
    id_hospital_int = int(id_hospital) if id_hospital else None
    
    return jsonify(TransferenciaDatabase().get_hospitais(id_hospital_int)), 200


@transferencia_blueprint.route("/hospitais", methods=["POST"])
def post_hospital():
    json = request.get_json()
    nome = json.get("nome", "")
    endereco = json.get("endereco", "")
    telefone = json.get("telefone", "")
    
    registro = TransferenciaDatabase().registra_hospital(nome, endereco, telefone)
    
    if not registro:
        return jsonify("Não foi possível registrar o hospital"), 400
    
    return jsonify("Hospital registrado com sucesso"), 200


@transferencia_blueprint.route("/transferencias/resumo", methods=["GET"])
def get_transferencias_resumo():
    status = request.args.get("status", "")
    status_filter = status if status else None
    return jsonify(TransferenciaDatabase().get_transferencias_resumo(status_filter)), 200


@transferencia_blueprint.route("/transferencias/paciente", methods=["GET"])
def transferencias_paciente():
    cpf = request.args.get("cpf", "")
    if not cpf:
        return jsonify("Parâmetro 'cpf' é obrigatório"), 400
    return jsonify(TransferenciaDatabase().get_transferencias_por_paciente(cpf)), 200

