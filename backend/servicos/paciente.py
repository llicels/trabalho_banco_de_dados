from servicos.database.conector import DatabaseManager


class PacienteDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_pacientes(self, cpf: str = None):
        query = "SELECT * FROM Paciente"
        if cpf:
            query += f" WHERE CPF = '{cpf}'"
        return self.db.execute_select_all(query)

    def registra_paciente(self, rg: str, endereco: str, cpf: str, data_nascimento: str, nome: str, telefone: str) -> bool:
        statement = f"""INSERT INTO Paciente (Rg, Endereço, CPF, Data_de_Nascimento, Nome, Telefone) 
                        VALUES ('{rg}', '{endereco}', '{cpf}', '{data_nascimento}', '{nome}', '{telefone}');"""
        return self.db.execute_statement(statement)

    def get_condicoes_paciente(self, cpf: str):
        query = f"SELECT * FROM Condicoes_Paciente WHERE CPF_Paciente = '{cpf}'"
        return self.db.execute_select_all(query)

    def adiciona_condicao(self, cpf: str, condicao: str) -> bool:
        statement = f"""INSERT INTO Condicoes_Paciente (Condicoes, CPF_Paciente) 
                        VALUES ('{condicao}', '{cpf}');"""
        return self.db.execute_statement(statement)

    def get_alergias_paciente(self, cpf: str):
        query = f"SELECT * FROM Alergias_Paciente WHERE CPF_Paciente = '{cpf}'"
        return self.db.execute_select_all(query)

    def adiciona_alergia(self, cpf: str, alergia: str) -> bool:
        statement = f"""INSERT INTO Alergias_Paciente (Alergias, CPF_Paciente) 
                        VALUES ('{alergia}', '{cpf}');"""
        return self.db.execute_statement(statement)

