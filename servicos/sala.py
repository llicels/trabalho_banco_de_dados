from servicos.database.conector import DatabaseManager


class SalaDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_salas(self, id_sala: int = None, tipo: str = None):
        query = "SELECT * FROM Sala"
        conditions = []
        if id_sala:
            conditions.append(f"ID_Sala = {id_sala}")
        if tipo:
            conditions.append(f"Tipo = '{tipo}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_sala(self, tipo: str) -> bool:
        statement = f"INSERT INTO Sala (Tipo) VALUES ('{tipo}');"
        return self.db.execute_statement(statement)

    def get_salas_raio_x(self, id_sala: int = None):
        query = "SELECT * FROM Sala_de_Raio_X"
        if id_sala:
            query += f" WHERE ID_Sala_Raio_X = {id_sala}"
        return self.db.execute_select_all(query)

    def registra_sala_raio_x(self) -> bool:
        statement = "INSERT INTO Sala_de_Raio_X DEFAULT VALUES;"
        return self.db.execute_statement(statement)

    def get_consultorios(self, id_consultorio: int = None, tipo: str = None):
        query = "SELECT * FROM Consultório"
        conditions = []
        if id_consultorio:
            conditions.append(f"ID_Consultório = {id_consultorio}")
        if tipo:
            conditions.append(f"Tipo = '{tipo}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_consultorio(self, tipo: str) -> bool:
        statement = f"INSERT INTO Consultório (Tipo) VALUES ('{tipo}');"
        return self.db.execute_statement(statement)

    def registra_uso_consultorio(self, id_consultorio: int, id_turno: int, cpf_medico: str = None, 
                                 cpf_dentista: str = None, cpf_assistente_social: str = None) -> bool:
        campos = ["ID_Consultório", "ID_Turno"]
        valores = [f"{id_consultorio}", f"{id_turno}"]
        if cpf_medico:
            campos.append("CPF_Médico")
            valores.append(f"'{cpf_medico}'")
        if cpf_dentista:
            campos.append("CPF_Dentista")
            valores.append(f"'{cpf_dentista}'")
        if cpf_assistente_social:
            campos.append("CPF_Assistente_Social")
            valores.append(f"'{cpf_assistente_social}'")
        statement = f"""INSERT INTO Uso_Consultório ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

