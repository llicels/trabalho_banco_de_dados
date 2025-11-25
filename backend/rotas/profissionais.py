from flask import Blueprint, jsonify, request
from servicos.profissionais import ProfissionaisDatabase

profissionais_blueprint = Blueprint("profissionais", __name__)


# Médico
@profissionais_blueprint.route("/medicos", methods=["GET"])
def get_medicos():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_medicos(cpf if cpf else None)), 200


@profissionais_blueprint.route("/medicos", methods=["POST"])
def post_medico():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    crm = json.get("crm", "")
    rqe = json.get("rqe", None)
    
    registro = ProfissionaisDatabase().registra_medico(nome, cpf, telefone, crm, rqe)
    
    if not registro:
        return jsonify("Não foi possível registrar o médico"), 400
    
    return jsonify("Médico cadastrado com sucesso"), 200


# Dentista
@profissionais_blueprint.route("/dentistas", methods=["GET"])
def get_dentistas():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_dentistas(cpf if cpf else None)), 200


@profissionais_blueprint.route("/dentistas", methods=["POST"])
def post_dentista():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    cro = json.get("cro", "")
    
    registro = ProfissionaisDatabase().registra_dentista(nome, cpf, telefone, cro)
    
    if not registro:
        return jsonify("Não foi possível registrar o dentista"), 400
    
    return jsonify("Dentista cadastrado com sucesso"), 200


# Assistente Social
@profissionais_blueprint.route("/assistentes-sociais", methods=["GET"])
def get_assistentes_sociais():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_assistentes_sociais(cpf if cpf else None)), 200


@profissionais_blueprint.route("/assistentes-sociais", methods=["POST"])
def post_assistente_social():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    cress = json.get("cress", "")
    
    registro = ProfissionaisDatabase().registra_assistente_social(nome, cpf, telefone, cress)
    
    if not registro:
        return jsonify("Não foi possível registrar o assistente social"), 400
    
    return jsonify("Assistente social cadastrado com sucesso"), 200


# Técnico de Radiologia
@profissionais_blueprint.route("/tecnicos-radiologia", methods=["GET"])
def get_tecnicos_radiologia():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_tecnicos_radiologia(cpf if cpf else None)), 200


@profissionais_blueprint.route("/tecnicos-radiologia", methods=["POST"])
def post_tecnico_radiologia():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    crtr = json.get("crtr", "")
    id_sala_raio_x = json.get("id_sala_raio_x", None)
    
    registro = ProfissionaisDatabase().registra_tecnico_radiologia(nome, cpf, telefone, crtr, id_sala_raio_x)
    
    if not registro:
        return jsonify("Não foi possível registrar o técnico de radiologia"), 400
    
    return jsonify("Técnico de radiologia cadastrado com sucesso"), 200


# Profissional de Enfermagem
@profissionais_blueprint.route("/profissionais-enfermagem", methods=["GET"])
def get_profissionais_enfermagem():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_profissionais_enfermagem(cpf if cpf else None)), 200


@profissionais_blueprint.route("/profissionais-enfermagem", methods=["POST"])
def post_profissional_enfermagem():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    coren = json.get("coren", "")
    categoria = json.get("categoria", "")
    id_sala = json.get("id_sala", None)
    
    registro = ProfissionaisDatabase().registra_profissional_enfermagem(nome, cpf, telefone, coren, categoria, id_sala)
    
    if not registro:
        return jsonify("Não foi possível registrar o profissional de enfermagem"), 400
    
    return jsonify("Profissional de enfermagem cadastrado com sucesso"), 200


# Colaborador Geral
@profissionais_blueprint.route("/colaboradores-gerais", methods=["GET"])
def get_colaboradores_gerais():
    cpf = request.args.get("cpf", "")
    return jsonify(ProfissionaisDatabase().get_colaboradores_gerais(cpf if cpf else None)), 200


@profissionais_blueprint.route("/colaboradores-gerais", methods=["POST"])
def post_colaborador_geral():
    json = request.get_json()
    nome = json.get("nome", "")
    cpf = json.get("cpf", "")
    telefone = json.get("telefone", "")
    funcao = json.get("funcao", "")
    
    registro = ProfissionaisDatabase().registra_colaborador_geral(nome, cpf, telefone, funcao)
    
    if not registro:
        return jsonify("Não foi possível registrar o colaborador geral"), 400
    
    return jsonify("Colaborador geral cadastrado com sucesso"), 200

