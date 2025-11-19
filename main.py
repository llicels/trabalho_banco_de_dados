from flask import Flask, jsonify
from flask_cors import CORS
from rotas.paciente import paciente_blueprint
from rotas.atendimento import atendimento_blueprint
from rotas.profissionais import profissionais_blueprint
from rotas.leito import leito_blueprint
from rotas.sala import sala_blueprint
from rotas.turno import turno_blueprint
from rotas.equipamento import equipamento_blueprint
from rotas.transferencia import transferencia_blueprint

app = Flask(__name__)

CORS(app, origins="*")

@app.route("/", methods=["GET"])
def get_status():
    return jsonify("Sistema UPA - It's alive"), 200


app.register_blueprint(paciente_blueprint)
app.register_blueprint(atendimento_blueprint)
app.register_blueprint(profissionais_blueprint)
app.register_blueprint(leito_blueprint)
app.register_blueprint(sala_blueprint)
app.register_blueprint(turno_blueprint)
app.register_blueprint(equipamento_blueprint)
app.register_blueprint(transferencia_blueprint)

app.run("0.0.0.0", port=8000, debug=False)


