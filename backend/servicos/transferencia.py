from servicos.database.conector import DatabaseManager


class TransferenciaDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_transferencias(self, id_transferencia: int = None, id_atendimento: int = None, id_hospital: int = None):
        query = "SELECT * FROM Transferência"
        conditions = []
        if id_transferencia:
            conditions.append(f"ID_Transferência = {id_transferencia}")
        if id_atendimento:
            conditions.append(f"ID_Atendimento = {id_atendimento}")
        if id_hospital:
            conditions.append(f"ID_Hospital = {id_hospital}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_transferencia(self, data_transferencia: str, justificativa: str, 
                               status_transferencia: str, transporte: str, id_atendimento: int, id_hospital: int) -> bool:
        statement = f"""INSERT INTO Transferência (Data_Transferência, Justificativa, Status_Tranferência, Transporte, ID_Atendimento, ID_Hospital) 
                        VALUES ('{data_transferencia}', '{justificativa}', '{status_transferencia}', '{transporte}', {id_atendimento}, {id_hospital});"""
        return self.db.execute_statement(statement)

    def get_hospitais(self, id_hospital: int = None):
        query = "SELECT * FROM Hospital"
        conditions = []
        if id_hospital:
            conditions.append(f"ID_Hospital = {id_hospital}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_hospital(self, nome: str, endereco: str, telefone: str) -> bool:
        statement = f"""INSERT INTO Hospital (Nome, Endereço, Telefone) 
                        VALUES ('{nome}', '{endereco}', '{telefone}');"""
        return self.db.execute_statement(statement)

    def get_transferencias_por_paciente(self, cpf: str):
        query = f"""
        SELECT p.nome,
               t.justificativa,
               t.status_tranferência,
               h.nome AS destino
        FROM paciente AS p
        JOIN atendimento AS a ON p.cpf = a.cpf_paciente
        JOIN transferência AS t ON a.id_atendimento = t.id_atendimento
        JOIN hospital AS h ON t.id_hospital = h.id_hospital
        WHERE p.cpf = '{cpf}';
        """
        return self.db.execute_select_all(query)

    def get_transferencias_resumo(self, status: str = None):
        query = """
        SELECT
            t.ID_Transferência AS id_transferencia,
            t.Data_Transferência AS data_transferencia,
            t.Justificativa AS justificativa,
            t.Status_Tranferência AS status_transferencia,
            t.Transporte AS transporte,
            t.ID_Atendimento AS id_atendimento,
            t.ID_Hospital AS id_hospital,
            h.Nome AS nome_hospital,
            h.Endereço AS endereco_hospital,
            p.Nome AS nome_paciente,
            p.CPF AS cpf_paciente
        FROM Transferência AS t
        JOIN Hospital AS h ON t.ID_Hospital = h.ID_Hospital
        JOIN Atendimento AS a ON t.ID_Atendimento = a.ID_Atendimento
        JOIN Paciente AS p ON a.CPF_Paciente = p.CPF
        """
        if status:
            query += f" WHERE t.Status_Tranferência = '{status}'"
        query += " ORDER BY t.Data_Transferência DESC, t.ID_Transferência DESC;"
        return self.db.execute_select_all(query)

