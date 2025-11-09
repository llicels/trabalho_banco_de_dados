from servicos.database.conector import DatabaseManager


class TurnoDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_turnos(self, id_turno: int = None):
        query = "SELECT * FROM Turno"
        if id_turno:
            query += f" WHERE ID_Turno = {id_turno}"
        return self.db.execute_select_all(query)

    def registra_turno(self, dia_semana: str, hora_chegada: str, hora_saida: str) -> bool:
        statement = f"""INSERT INTO Turno (Dia_da_Semana, Hora_Chegada, Hora_Saída) 
                        VALUES ('{dia_semana}', '{hora_chegada}', '{hora_saida}');"""
        return self.db.execute_statement(statement)

    def adiciona_medico_turno(self, id_turno: int, cpf_medico: str) -> bool:
        statement = f"""INSERT INTO Turno_Médico (ID_Turno, CPF_Médico) 
                        VALUES ({id_turno}, '{cpf_medico}');"""
        return self.db.execute_statement(statement)

    def adiciona_dentista_turno(self, id_turno: int, cpf_dentista: str) -> bool:
        statement = f"""INSERT INTO Turno_Dentista (ID_Turno, CPF_Dentista) 
                        VALUES ({id_turno}, '{cpf_dentista}');"""
        return self.db.execute_statement(statement)

    def adiciona_assistente_social_turno(self, id_turno: int, cpf_assistente_social: str) -> bool:
        statement = f"""INSERT INTO Turno_Assistente_Social (ID_Turno, CPF_Assistente_Social) 
                        VALUES ({id_turno}, '{cpf_assistente_social}');"""
        return self.db.execute_statement(statement)

    def adiciona_profissional_enfermagem_turno(self, id_turno: int, cpf_profissional: str) -> bool:
        statement = f"""INSERT INTO Turno_Profissional_Enfermagem (ID_Turno, CPF_Profissional) 
                        VALUES ({id_turno}, '{cpf_profissional}');"""
        return self.db.execute_statement(statement)

    def adiciona_tecnico_radiologia_turno(self, id_turno: int, cpf_tecnico: str) -> bool:
        statement = f"""INSERT INTO Turno_Técnico_de_Radiologia (ID_Turno, CPF_Técnico) 
                        VALUES ({id_turno}, '{cpf_tecnico}');"""
        return self.db.execute_statement(statement)

    def adiciona_colaborador_geral_turno(self, id_turno: int, cpf_colaborador: str) -> bool:
        statement = f"""INSERT INTO Turno_Colaborador_Geral (ID_Turno, CPF_Colaborador) 
                        VALUES ({id_turno}, '{cpf_colaborador}');"""
        return self.db.execute_statement(statement)

