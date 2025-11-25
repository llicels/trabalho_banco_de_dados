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

    def get_escala_por_colaborador(self, cpf: str):
        query = f"""
        SELECT
            t.Dia_da_Semana,
            t.Hora_Chegada,
            t.Hora_Saída,
            vc.Nome,
            vc.Funcao
        FROM Turno t
        JOIN (
            (SELECT ID_Turno, CPF_Médico AS CPF FROM Turno_Médico)
            UNION ALL
            (SELECT ID_Turno, CPF_Dentista AS CPF FROM Turno_Dentista)
            UNION ALL
            (SELECT ID_Turno, CPF_Assistente_Social AS CPF FROM Turno_Assistente_Social)
            UNION ALL
            (SELECT ID_Turno, CPF_Técnico AS CPF FROM Turno_Técnico_de_Radiologia)
            UNION ALL
            (SELECT ID_Turno, CPF_Profissional AS CPF FROM Turno_Profissional_Enfermagem)
            UNION ALL
            (SELECT ID_Turno, CPF_Colaborador AS CPF FROM Turno_Colaborador_Geral)
        ) vt ON t.ID_Turno = vt.ID_Turno
        JOIN (
            (SELECT CPF, Nome, 'Médico' AS Funcao FROM Médico)
            UNION ALL
            (SELECT CPF, Nome, 'Dentista' AS Funcao FROM Dentista)
            UNION ALL
            (SELECT CPF, Nome, 'Assistente Social' AS Funcao FROM Assistente_Social)
            UNION ALL
            (SELECT CPF, Nome, 'Técnico(a) Radiologia' AS Funcao FROM Técnico_de_Radiologia)
            UNION ALL
            (SELECT CPF, Nome,
                CASE WHEN Categoria = 'E' THEN 'Enfermeiro(a)' ELSE 'Técnico(a) Enfermagem' END AS Funcao
             FROM Profissional_de_Enfermagem)
            UNION ALL
            (SELECT CPF, Nome, Função AS Funcao FROM Colaborador_Geral)
        ) vc ON vt.CPF = vc.CPF
        WHERE vc.CPF = '{cpf}';
        """
        return self.db.execute_select_all(query)

    def get_escala_por_data(self, data: str):
        query = f"""
        SELECT
            t.Dia_da_Semana,
            t.Hora_Chegada,
            t.Hora_Saída,
            vc.Nome AS Nome_Colaborador,
            vc.Funcao
        FROM Turno t
        JOIN (
            (SELECT ID_Turno, CPF_Médico AS CPF FROM Turno_Médico)
            UNION ALL
            (SELECT ID_Turno, CPF_Dentista AS CPF FROM Turno_Dentista)
            UNION ALL
            (SELECT ID_Turno, CPF_Assistente_Social AS CPF FROM Turno_Assistente_Social)
            UNION ALL
            (SELECT ID_Turno, CPF_Técnico AS CPF FROM Turno_Técnico_de_Radiologia)
            UNION ALL
            (SELECT ID_Turno, CPF_Profissional AS CPF FROM Turno_Profissional_Enfermagem)
            UNION ALL
            (SELECT ID_Turno, CPF_Colaborador AS CPF FROM Turno_Colaborador_Geral)
        ) vt ON t.ID_Turno = vt.ID_Turno
        JOIN (
            (SELECT CPF, Nome, 'Médico' AS Funcao FROM Médico)
            UNION ALL
            (SELECT CPF, Nome, 'Dentista' AS Funcao FROM Dentista)
            UNION ALL
            (SELECT CPF, Nome, 'Assistente Social' AS Funcao FROM Assistente_Social)
            UNION ALL
            (SELECT CPF, Nome, 'Técnico(a) Radiologia' AS Funcao FROM Técnico_de_Radiologia)
            UNION ALL
            (SELECT CPF, Nome,
                CASE WHEN Categoria = 'E' THEN 'Enfermeiro(a)' ELSE 'Técnico(a) Enfermagem' END AS Funcao
             FROM Profissional_de_Enfermagem)
            UNION ALL
            (SELECT CPF, Nome, Função AS Funcao FROM Colaborador_Geral)
        ) vc ON vt.CPF = vc.CPF
        WHERE CAST(t.Hora_Chegada AS DATE) = '{data}'
        ORDER BY t.Hora_Chegada, vc.Funcao, vc.Nome;
        """
        return self.db.execute_select_all(query)

    def get_escala_por_intervalo(self, data_inicio: str, data_fim: str):
        query = f"""
        SELECT
            t.Dia_da_Semana,
            t.Hora_Chegada,
            t.Hora_Saída,
            vc.Nome AS Nome_Colaborador,
            vc.Funcao
        FROM Turno t
        JOIN (
            (SELECT ID_Turno, CPF_Médico AS CPF FROM Turno_Médico)
            UNION ALL
            (SELECT ID_Turno, CPF_Dentista AS CPF FROM Turno_Dentista)
            UNION ALL
            (SELECT ID_Turno, CPF_Assistente_Social AS CPF FROM Turno_Assistente_Social)
            UNION ALL
            (SELECT ID_Turno, CPF_Técnico AS CPF FROM Turno_Técnico_de_Radiologia)
            UNION ALL
            (SELECT ID_Turno, CPF_Profissional AS CPF FROM Turno_Profissional_Enfermagem)
            UNION ALL
            (SELECT ID_Turno, CPF_Colaborador AS CPF FROM Turno_Colaborador_Geral)
        ) vt ON t.ID_Turno = vt.ID_Turno
        JOIN (
            (SELECT CPF, Nome, 'Médico' AS Funcao FROM Médico)
            UNION ALL
            (SELECT CPF, Nome, 'Dentista' AS Funcao FROM Dentista)
            UNION ALL
            (SELECT CPF, Nome, 'Assistente Social' AS Funcao FROM Assistente_Social)
            UNION ALL
            (SELECT CPF, Nome, 'Técnico(a) Radiologia' AS Funcao FROM Técnico_de_Radiologia)
            UNION ALL
            (SELECT CPF, Nome,
                CASE WHEN Categoria = 'E' THEN 'Enfermeiro(a)' ELSE 'Técnico(a) Enfermagem' END AS Funcao
             FROM Profissional_de_Enfermagem)
            UNION ALL
            (SELECT CPF, Nome, Função AS Funcao FROM Colaborador_Geral)
        ) vc ON vt.CPF = vc.CPF
        WHERE CAST(t.Hora_Chegada AS DATE) BETWEEN '{data_inicio}' AND '{data_fim}'
        ORDER BY
            CASE
                WHEN t.Dia_da_Semana = 'Domingo' THEN 1
                WHEN t.Dia_da_Semana = 'Segunda' THEN 2
                WHEN t.Dia_da_Semana = 'Terça' THEN 3
                WHEN t.Dia_da_Semana = 'Quarta' THEN 4
                WHEN t.Dia_da_Semana = 'Quinta' THEN 5
                WHEN t.Dia_da_Semana = 'Sexta' THEN 6
                WHEN t.Dia_da_Semana = 'Sábado' THEN 7
            END,
            t.Hora_Chegada,
            vc.Funcao;
        """
        return self.db.execute_select_all(query)

    def get_colaboradores_por_turno(self, id_turno: int):
        query = f"""
        SELECT
            vc.nome,
            vc.funcao
        FROM (
            (SELECT CPF, Nome, 'Médico' AS Funcao FROM Médico)
            UNION ALL
            (SELECT CPF, Nome, 'Dentista' AS Funcao FROM Dentista)
            UNION ALL
            (SELECT CPF, Nome, 'Assistente Social' AS Funcao FROM Assistente_Social)
            UNION ALL
            (SELECT CPF, Nome, 'Técnico(a) Radiologia' AS Funcao FROM Técnico_de_Radiologia)
            UNION ALL
            (SELECT CPF, Nome,
                CASE WHEN Categoria = 'E' THEN 'Enfermeiro(a)' ELSE 'Técnico(a) Enfermagem' END AS Funcao
             FROM Profissional_de_Enfermagem)
            UNION ALL
            (SELECT CPF, Nome, Função AS Funcao FROM Colaborador_Geral)
        ) vc
        JOIN (
            (SELECT ID_Turno, CPF_Médico AS CPF FROM Turno_Médico)
            UNION ALL
            (SELECT ID_Turno, CPF_Dentista AS CPF FROM Turno_Dentista)
            UNION ALL
            (SELECT ID_Turno, CPF_Assistente_Social AS CPF FROM Turno_Assistente_Social)
            UNION ALL
            (SELECT ID_Turno, CPF_Técnico AS CPF FROM Turno_Técnico_de_Radiologia)
            UNION ALL
            (SELECT ID_Turno, CPF_Profissional AS CPF FROM Turno_Profissional_Enfermagem)
            UNION ALL
            (SELECT ID_Turno, CPF_Colaborador AS CPF FROM Turno_Colaborador_Geral)
        ) vt ON vt.CPF = vc.CPF
        WHERE vt.ID_Turno = {id_turno};
        """
        return self.db.execute_select_all(query)

