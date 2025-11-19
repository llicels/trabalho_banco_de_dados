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
    


    def consultar_atendimentos_por_periodo(self, data_inicio: str, data_fim: str, 
                                        cpf_paciente: str = None, 
                                        cpf_profissional: str = None):
        """
        Consulta atendimentos por período, opcionalmente filtrado por paciente ou profissional
        Retorna informações completas incluindo profissionais envolvidos
        """
        query = f"""
        SELECT 
            a.ID_Atendimento,
            a.Data_Hora_Entrada,
            a.Data_Hora_Saída,
            a.CID,
            a.Nível_de_Risco,
            a.Observações,
            a.Temperatura,
            a.Pressão_Arterial,
            a.Frequência_Cardíaca,
            p.Nome AS Nome_Paciente,
            p.CPF AS CPF_Paciente,
            m.Nome AS Nome_Medico,
            d.Nome AS Nome_Dentista,
            pe.Nome AS Nome_Enfermagem
        FROM Atendimento a
        INNER JOIN Paciente p ON a.CPF_Paciente = p.CPF
        LEFT JOIN Médico m ON a.CPF_Médico = m.CPF
        LEFT JOIN Dentista d ON a.CPF_Dentista = d.CPF
        LEFT JOIN Profissional_de_Enfermagem pe ON a.CPF_Profissional_de_Enfermagem = pe.CPF
        WHERE a.Data_Hora_Entrada >= '{data_inicio}' AND a.Data_Hora_Entrada <= '{data_fim}'
        """
        
        if cpf_paciente:
            query += f" AND a.CPF_Paciente = '{cpf_paciente}'"
        
        if cpf_profissional:
            query += f""" AND (
                a.CPF_Médico = '{cpf_profissional}' OR 
                a.CPF_Dentista = '{cpf_profissional}' OR 
                a.CPF_Profissional_de_Enfermagem = '{cpf_profissional}' OR
                a.CPF_Assistente_Social = '{cpf_profissional}' OR
                a.CPF_Técnico_de_Radiologia = '{cpf_profissional}'
            )"""
        
        query += " ORDER BY a.Data_Hora_Entrada DESC"
        
        return self.db.execute_select_all(query)
    
    