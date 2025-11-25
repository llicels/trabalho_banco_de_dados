from flask import Blueprint, jsonify, request
from servicos.equipamento import EquipamentoDatabase, MedicamentoDatabase

equipamento_blueprint = Blueprint("equipamento", __name__)


@equipamento_blueprint.route("/equipamentos", methods=["GET"])
def get_equipamentos():
    id_equipamento = request.args.get("id", "")
    
    id_equipamento_int = int(id_equipamento) if id_equipamento else None
    
    return jsonify(EquipamentoDatabase().get_equipamentos(id_equipamento_int)), 200


@equipamento_blueprint.route("/equipamentos", methods=["POST"])
def post_equipamento():
    json = request.get_json()
    nome = json.get("nome", "")
    ultima_manutencao = json.get("ultima_manutencao", "")
    
    registro = EquipamentoDatabase().registra_equipamento(nome, ultima_manutencao)
    
    if not registro:
        return jsonify("Não foi possível registrar o equipamento"), 400
    
    return jsonify("Equipamento registrado com sucesso"), 200


@equipamento_blueprint.route("/equipamentos/<int:id_equipamento>/manutencao", methods=["PUT"])
def atualizar_manutencao(id_equipamento):
    json = request.get_json()
    data_manutencao = json.get("data_manutencao", "")
    
    registro = EquipamentoDatabase().atualiza_manutencao(id_equipamento, data_manutencao)
    
    if not registro:
        return jsonify("Não foi possível atualizar a manutenção"), 400
    
    return jsonify("Manutenção atualizada com sucesso"), 200


@equipamento_blueprint.route("/medicamentos", methods=["GET"])
def get_medicamentos():
    nome = request.args.get("nome", "")
    
    nome_str = nome if nome else None
    
    return jsonify(MedicamentoDatabase().get_medicamentos(nome_str)), 200


@equipamento_blueprint.route("/medicamentos", methods=["POST"])
def post_medicamento():
    json = request.get_json()
    nome = json.get("nome", "")
    
    registro = MedicamentoDatabase().registra_medicamento(nome)
    
    if not registro:
        return jsonify("Não foi possível registrar o medicamento"), 400
    
    return jsonify("Medicamento registrado com sucesso"), 200

