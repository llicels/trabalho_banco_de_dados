from servicos.database.conector import DatabaseManager


class TransferenciaDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_transferencias(self, id_transferencia: int = None, id_atendimento: int = None):
        query = "SELECT * FROM Transferência"
        conditions = []
        if id_transferencia:
            conditions.append(f"ID_Transferência = {id_transferencia}")
        if id_atendimento:
            conditions.append(f"ID_Atendimento = {id_atendimento}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_transferencia(self, data_transferencia: str, justificativa: str, 
                               status_transferencia: str, transporte: str, id_atendimento: int) -> bool:
        statement = f"""INSERT INTO Transferência (Data_Transferência, Justificativa, Status_Tranferência, Transporte, ID_Atendimento) 
                        VALUES ('{data_transferencia}', '{justificativa}', '{status_transferencia}', '{transporte}', {id_atendimento});"""
        return self.db.execute_statement(statement)

    def get_hospitais(self, id_hospital: int = None, id_transferencia: int = None):
        query = "SELECT * FROM Hospital"
        conditions = []
        if id_hospital:
            conditions.append(f"ID_Hospital = {id_hospital}")
        if id_transferencia:
            conditions.append(f"ID_Transferência = {id_transferencia}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_hospital(self, nome: str, endereco: str, telefone: str, id_transferencia: int) -> bool:
        statement = f"""INSERT INTO Hospital (Nome, Endereço, Telefone, ID_Transferência) 
                        VALUES ('{nome}', '{endereco}', '{telefone}', {id_transferencia});"""
        return self.db.execute_statement(statement)

