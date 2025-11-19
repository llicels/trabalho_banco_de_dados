from servicos.database.conector import DatabaseManager


class ProfissionaisDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    # Médico
    def get_medicos(self, cpf: str = None):
        query = "SELECT * FROM Médico"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_medico(self, nome: str, cpf: str, telefone: str, crm: str, rqe: str = None) -> bool:
        campos = ["Nome", "CPF", "Telefone", "CRM"]
        valores = [f"'{nome}'", f"'{cpf}'", f"'{telefone}'", f"'{crm}'"]
        if rqe:
            campos.append("RQE")
            valores.append(f"'{rqe}'")
        statement = f"""INSERT INTO Médico ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

    # Dentista
    def get_dentistas(self, cpf: str = None):
        query = "SELECT * FROM Dentista"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_dentista(self, nome: str, cpf: str, telefone: str, cro: str) -> bool:
        statement = f"""INSERT INTO Dentista (Nome, CPF, Telefone, CRO) 
                        VALUES ('{nome}', '{cpf}', '{telefone}', '{cro}');"""
        return self.db.execute_statement(statement)

    # Assistente Social
    def get_assistentes_sociais(self, cpf: str = None):
        query = "SELECT * FROM Assistente_Social"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_assistente_social(self, nome: str, cpf: str, telefone: str, cress: str) -> bool:
        statement = f"""INSERT INTO Assistente_Social (Nome, CPF, Telefone, CRESS) 
                        VALUES ('{nome}', '{cpf}', '{telefone}', '{cress}');"""
        return self.db.execute_statement(statement)

    # Técnico de Radiologia
    def get_tecnicos_radiologia(self, cpf: str = None):
        query = "SELECT * FROM Técnico_de_Radiologia"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_tecnico_radiologia(self, nome: str, cpf: str, telefone: str, crtr: str, id_sala_raio_x: int = None) -> bool:
        campos = ["Nome", "CPF", "Telefone", "CRTR"]
        valores = [f"'{nome}'", f"'{cpf}'", f"'{telefone}'", f"'{crtr}'"]
        if id_sala_raio_x:
            campos.append("ID_Sala_de_Raio_X")
            valores.append(f"{id_sala_raio_x}")
        statement = f"""INSERT INTO Técnico_de_Radiologia ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

    # Profissional de Enfermagem
    def get_profissionais_enfermagem(self, cpf: str = None):
        query = "SELECT * FROM Profissional_de_Enfermagem"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_profissional_enfermagem(self, nome: str, cpf: str, telefone: str, coren: str, categoria: str, id_sala: int = None) -> bool:
        campos = ["Nome", "CPF", "Telefone", "COREN", "Categoria"]
        valores = [f"'{nome}'", f"'{cpf}'", f"'{telefone}'", f"'{coren}'", f"'{categoria}'"]
        if id_sala:
            campos.append("ID_Sala")
            valores.append(f"{id_sala}")
        statement = f"""INSERT INTO Profissional_de_Enfermagem ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

    # Colaborador Geral
    def get_colaboradores_gerais(self, cpf: str = None):
        query = "SELECT * FROM Colaborador_Geral"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_colaborador_geral(self, nome: str, cpf: str, telefone: str, funcao: str) -> bool:
        statement = f"""INSERT INTO Colaborador_Geral (Nome, CPF, Telefone, Função) 
                        VALUES ('{nome}', '{cpf}', '{telefone}', '{funcao}');"""
        return self.db.execute_statement(statement)

