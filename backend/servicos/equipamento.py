from servicos.database.conector import DatabaseManager


class EquipamentoDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_equipamentos(self, id_equipamento: int = None):
        query = "SELECT * FROM Equipamento_Raio_X"
        if id_equipamento:
            query += f" WHERE ID_Equipamento = {id_equipamento}"
        return self.db.execute_select_all(query)

    def registra_equipamento(self, nome: str, ultima_manutencao: str) -> bool:
        statement = f"""INSERT INTO Equipamento_Raio_X (Nome, Última_Manutenção) 
                        VALUES ('{nome}', '{ultima_manutencao}');"""
        return self.db.execute_statement(statement)

    def atualiza_manutencao(self, id_equipamento: int, data_manutencao: str) -> bool:
        statement = f"""UPDATE Equipamento_Raio_X SET Última_Manutenção = '{data_manutencao}' 
                        WHERE ID_Equipamento = {id_equipamento};"""
        return self.db.execute_statement(statement)


class MedicamentoDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_medicamentos(self, nome: str = None):
        query = "SELECT * FROM Medicamento"
        if nome:
            query += f" WHERE Nome = '{nome}'"
        return self.db.execute_select_all(query)

    def registra_medicamento(self, nome: str) -> bool:
        statement = f"INSERT INTO Medicamento (Nome) VALUES ('{nome}');"
        return self.db.execute_statement(statement)

