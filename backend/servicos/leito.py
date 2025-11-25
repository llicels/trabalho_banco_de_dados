from servicos.database.conector import DatabaseManager


class LeitoDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_leitos(self, id_leito: int = None, tipo: str = None):
        query = "SELECT * FROM Leito"
        conditions = []
        if id_leito:
            conditions.append(f"ID_Leito = {id_leito}")
        if tipo:
            conditions.append(f"Tipo = '{tipo}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_leito(self, tipo: str) -> bool:
        statement = f"INSERT INTO Leito (Tipo) VALUES ('{tipo}');"
        return self.db.execute_statement(statement)

    def get_ocupacoes(self, cpf_paciente: str = None, id_leito: int = None):
        query = "SELECT * FROM Paciete_Ocupa_Leito"
        conditions = []
        if cpf_paciente:
            conditions.append(f"CPF_Paciente = '{cpf_paciente}'")
        if id_leito:
            conditions.append(f"ID_Leito = {id_leito}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_ocupacao(self, cpf_paciente: str, id_leito: int, data_entrada: str, data_alta: str = None) -> bool:
        campos = ["CPF_Paciente", "ID_Leito", "Data_de_Entrada"]
        valores = [f"'{cpf_paciente}'", f"{id_leito}", f"'{data_entrada}'"]
        if data_alta:
            campos.append("Data_de_Alta")
            valores.append(f"'{data_alta}'")
        statement = f"""INSERT INTO Paciete_Ocupa_Leito ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

    def finaliza_ocupacao(self, cpf_paciente: str, id_leito: int, data_alta: str) -> bool:
        statement = f"""UPDATE Paciete_Ocupa_Leito SET Data_de_Alta = '{data_alta}' 
                        WHERE CPF_Paciente = '{cpf_paciente}' AND ID_Leito = {id_leito} 
                        AND Data_de_Alta IS NULL;"""
        return self.db.execute_statement(statement)

    def get_leitos_disponiveis_por_tipo(self, tipo: str):
        query = f"""
        SELECT
            l.ID_Leito,
            l.Tipo
        FROM Leito AS l
        WHERE
            l.Tipo = '{tipo}'
            AND NOT EXISTS (
                SELECT 1
                FROM Paciete_Ocupa_Leito AS pol
                WHERE pol.ID_Leito = l.ID_Leito
                  AND pol.Data_de_Alta IS NULL
            );
        """
        return self.db.execute_select_all(query)

