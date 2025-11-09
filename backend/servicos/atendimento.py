from servicos.database.conector import DatabaseManager


class AtendimentoDatabase:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_atendimentos(self, id_atendimento: int = None, cpf_paciente: str = None):
        query = "SELECT * FROM Atendimento"
        conditions = []
        if id_atendimento:
            conditions.append(f"ID_Atendimento = {id_atendimento}")
        if cpf_paciente:
            conditions.append(f"CPF_Paciente = '{cpf_paciente}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        return self.db.execute_select_all(query)

    def registra_atendimento(
        self, data_hora_entrada: str, cid: str, observacoes: str, temperatura: int,
        pressao_arterial: str, nivel_risco: str, frequencia_cardiaca: int,
        cpf_paciente: str, cpf_medico: str = None, cpf_dentista: str = None,
        cpf_assistente_social: str = None, cpf_tecnico_radiologia: str = None,
        cpf_profissional_enfermagem: str = None, data_hora_saida: str = None
    ) -> bool:
        campos = ["Data_Hora_Entrada", "CID", "Observações", "Temperatura", 
                  "Pressão_Arterial", "Nível_de_Risco", "Frequência_Cardíaca", "CPF_Paciente"]
        valores = [f"'{data_hora_entrada}'", f"'{cid}'", f"'{observacoes}'", 
                   f"{temperatura}", f"'{pressao_arterial}'", f"'{nivel_risco}'", 
                   f"{frequencia_cardiaca}", f"'{cpf_paciente}'"]
        
        if cpf_medico:
            campos.append("CPF_Médico")
            valores.append(f"'{cpf_medico}'")
        if cpf_dentista:
            campos.append("CPF_Dentista")
            valores.append(f"'{cpf_dentista}'")
        if cpf_assistente_social:
            campos.append("CPF_Assistente_Social")
            valores.append(f"'{cpf_assistente_social}'")
        if cpf_tecnico_radiologia:
            campos.append("CPF_Técnico_de_Radiologia")
            valores.append(f"'{cpf_tecnico_radiologia}'")
        if cpf_profissional_enfermagem:
            campos.append("CPF_Profissional_de_Enfermagem")
            valores.append(f"'{cpf_profissional_enfermagem}'")
        if data_hora_saida:
            campos.append("Data_Hora_Saída")
            valores.append(f"'{data_hora_saida}'")

        statement = f"""INSERT INTO Atendimento ({', '.join(campos)}) 
                        VALUES ({', '.join(valores)});"""
        return self.db.execute_statement(statement)

    def finaliza_atendimento(self, id_atendimento: int, data_hora_saida: str) -> bool:
        statement = f"""UPDATE Atendimento SET Data_Hora_Saída = '{data_hora_saida}' 
                        WHERE ID_Atendimento = {id_atendimento};"""
        return self.db.execute_statement(statement)

    def get_amostras_atendimento(self, id_atendimento: int):
        query = f"SELECT * FROM Amostra_Coletada WHERE ID_Atendimento = {id_atendimento}"
        return self.db.execute_select_all(query)

    def registra_amostra(self, tipo: str, exame: str, previsao_liberacao: str, id_atendimento: int) -> bool:
        statement = f"""INSERT INTO Amostra_Coletada (Tipo, Exame, Previsão_Liberação, ID_Atendimento) 
                        VALUES ('{tipo}', '{exame}', '{previsao_liberacao}', {id_atendimento});"""
        return self.db.execute_statement(statement)

    def adiciona_equipamento(self, id_atendimento: int, id_equipamento: int) -> bool:
        statement = f"""INSERT INTO Atendimento_Usa_Equipamento (ID_Atendimento, ID_Equipamento) 
                        VALUES ({id_atendimento}, {id_equipamento});"""
        return self.db.execute_statement(statement)

    def adiciona_medicamento(self, id_atendimento: int, nome_medicamento: str) -> bool:
        statement = f"""INSERT INTO Atendimento_Usa_Medicamento (ID_Atendimento, Nome_Medicamento) 
                        VALUES ({id_atendimento}, '{nome_medicamento}');"""
        return self.db.execute_statement(statement)

