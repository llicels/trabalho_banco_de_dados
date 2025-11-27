CREATE TABLE Paciente (
    Rg VARCHAR(9) NOT NULL,
    Endereço VARCHAR(30),
    CPF CHAR(11) PRIMARY KEY,
    Data_de_Nascimento DATE NOT NULL,
    Nome VARCHAR(15) NOT NULL,
    Telefone VARCHAR(20) NOT NULL
);


CREATE TABLE Condicoes_Paciente (
    ID_Condicoes SERIAL PRIMARY KEY,
    Condicoes VARCHAR(30) NOT NULL,
    CPF_Paciente CHAR(11),
    FOREIGN KEY (CPF_Paciente) REFERENCES Paciente(CPF)
);


CREATE TABLE Alergias_Paciente (
    ID_Alergias SERIAL PRIMARY KEY,
    Alergias VARCHAR(30) NOT NULL,
    CPF_Paciente CHAR(11),
    FOREIGN KEY (CPF_Paciente) REFERENCES Paciente(CPF)
);


--vou fazer a especializacao tipo 8B
--TELEFONE NAO VAI MAIS SER MULTIVALORADO


CREATE TABLE Sala_de_Raio_X(
    ID_Sala_Raio_X SERIAL PRIMARY KEY
);


CREATE TABLE Sala(
    ID_Sala SERIAL PRIMARY KEY,
    Tipo VARCHAR(10) NOT NULL CHECK (TIPO IN ('Gesso', 'Triagem', 'Coleta', 'Medicação'))
);


CREATE TABLE Dentista(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    CRO VARCHAR(15) NOT NULL
);


CREATE TABLE Assistente_Social(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    CRESS VARCHAR(6) NOT NULL
);


CREATE TABLE Médico(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    CRM CHAR(10) NOT NULL,
    RQE CHAR(3) -- é RQE nao CRE!!!!
);


CREATE TABLE Técnico_de_Radiologia(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    CRTR CHAR(7) NOT NULL,
    ID_Sala_de_Raio_X INT,
    CONSTRAINT fk_Tecnico_Sala FOREIGN KEY (ID_Sala_de_Raio_X) REFERENCES Sala_de_Raio_X(ID_Sala_Raio_X)
);


CREATE TABLE Profissional_de_Enfermagem(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    COREN VARCHAR(25) NOT NULL,
    Categoria CHAR(1) NOT NULL CHECK (Categoria IN ('E', 'T')), -- E para enfermeiro e T para técnico
    ID_Sala INT,
    CONSTRAINT fk_Enfermagem_Sala FOREIGN KEY (ID_Sala) REFERENCES Sala(ID_Sala)
);


CREATE TABLE Colaborador_Geral(
    Nome VARCHAR(15) NOT NULL,
    CPF CHAR(11) PRIMARY KEY,
    Telefone VARCHAR(20) NOT NULL,
    Função VARCHAR(25) NOT NULL
);


CREATE TABLE Leito(
    ID_Leito SERIAL PRIMARY KEY,
    Tipo VARCHAR(15) NOT NULL CHECK(Tipo IN ('Comum', 'Emergência'))
);


CREATE TABLE Paciete_Ocupa_Leito(
    Data_de_Entrada DATE,
    Data_de_Alta DATE,
    CPF_Paciente CHAR(11),
    ID_Leito INT,
    CONSTRAINT fk_Paciente FOREIGN KEY (CPF_Paciente) REFERENCES Paciente(CPF),
    CONSTRAINT fk_Leito FOREIGN KEY (ID_Leito) REFERENCES Leito(ID_Leito)
);


CREATE TABLE Atendimento(
    ID_Atendimento SERIAL PRIMARY KEY,
    Data_Hora_Entrada TIMESTAMP,
    Data_Hora_Saída TIMESTAMP,
    CID VARCHAR(7) NOT NULL,
    Observações VARCHAR(80),
    Temperatura INT NOT NULL,
    Pressão_Arterial VARCHAR(10) NOT NULL,
    Nível_de_Risco VARCHAR(15) NOT NULL,
    Frequência_Cardíaca INT NOT NULL,
    CPF_Paciente CHAR(11),
    CPF_Dentista CHAR(11),
    CPF_Assistente_Social CHAR(11),
    CPF_Médico CHAR(11),
    CPF_Técnico_de_Radiologia CHAR(11),
    CPF_Profissional_de_Enfermagem CHAR(11),
    CONSTRAINT fk_Paciente_Atendimento FOREIGN KEY (CPF_Paciente) REFERENCES Paciente(CPF),
    CONSTRAINT fk_Dentista_Atendimento FOREIGN KEY (CPF_Dentista) REFERENCES Dentista(CPF),
    CONSTRAINT fk_Assistente_Social_Atendimento FOREIGN KEY (CPF_Assistente_Social) REFERENCES Assistente_Social(CPF),
    CONSTRAINT fk_Médico_Atendimento FOREIGN KEY (CPF_Médico) REFERENCES Médico(CPF),
    CONSTRAINT fk_Técnico_de_Radiologia_Atendimento FOREIGN KEY (CPF_Técnico_de_Radiologia) REFERENCES Técnico_de_Radiologia(CPF),
    CONSTRAINT fk_Profissional_de_Enfermagem_Atendimento FOREIGN KEY (CPF_Profissional_de_Enfermagem) REFERENCES Profissional_de_Enfermagem(CPF)
);


CREATE TABLE Hospital(
    ID_Hospital SERIAL PRIMARY KEY,
    Nome VARCHAR(30) NOT NULL,
    Endereço VARCHAR(30) NOT NULL,
    Telefone VARCHAR(20) NOT NULL
);


CREATE TABLE Transferência(
    ID_Transferência SERIAL PRIMARY KEY,
    Data_Transferência DATE,
    Justificativa VARCHAR(40),
    Status_Tranferência VARCHAR(20),
    Transporte VARCHAR(20),
    ID_Atendimento INT,
    ID_Hospital INT,
    CONSTRAINT fk_Atendimento_Transferência FOREIGN KEY (ID_Atendimento) REFERENCES Atendimento(ID_Atendimento),
    CONSTRAINT fk_Hospital_Transferência FOREIGN KEY (ID_Hospital) REFERENCES Hospital(ID_Hospital)
);


CREATE TABLE Equipamento_Raio_X(
    ID_Equipamento SERIAL PRIMARY KEY,
    Nome VARCHAR(30) NOT NULL,
    Última_Manutenção DATE NOT NULL
);


CREATE TABLE Medicamento(
    Nome VARCHAR(30) PRIMARY KEY
);


CREATE TABLE Amostra_Coletada(
    ID_Amostra SERIAL PRIMARY KEY,
    Tipo VARCHAR(30) NOT NULL,
    Exame VARCHAR(30) NOT NULL,
    Previsão_Liberação TIMESTAMP NOT NULL,
    ID_Atendimento INT,
    FOREIGN KEY (ID_Atendimento) REFERENCES Atendimento(ID_Atendimento)
);


CREATE TABLE Atendimento_Usa_Equipamento(
    ID_Atendimento INT,
    ID_Equipamento INT,
    PRIMARY KEY(ID_Atendimento, ID_Equipamento),
    FOREIGN KEY (ID_Atendimento) REFERENCES Atendimento(ID_Atendimento),
    FOREIGN KEY (ID_Equipamento) REFERENCES Equipamento_Raio_X(ID_Equipamento)
);


CREATE TABLE Atendimento_Usa_Medicamento(
    ID_Atendimento INT,
    Nome_Medicamento VARCHAR(30),
    PRIMARY KEY(ID_Atendimento, Nome_Medicamento),
    FOREIGN KEY (ID_Atendimento) REFERENCES Atendimento(ID_Atendimento),
    FOREIGN KEY (Nome_Medicamento) REFERENCES Medicamento(Nome)
);


CREATE TABLE Consultório(
    ID_Consultório SERIAL PRIMARY KEY,
    Tipo VARCHAR(12) NOT NULL CHECK (Tipo IN ('Geral', 'Odontológico'))
);


CREATE TABLE Uso_Consultório(
    ID_Consultório INT,
    ID_Turno INT,
    CPF_Dentista CHAR(11),
    CPF_Médico CHAR(11),
    CPF_Assistente_Social CHAR(11),
    PRIMARY KEY(ID_Consultório, ID_Turno),
    CONSTRAINT fk_Dentista_Atendimento FOREIGN KEY (CPF_Dentista) REFERENCES Dentista(CPF),
    CONSTRAINT fk_Assistente_Social_Atendimento FOREIGN KEY (CPF_Assistente_Social) REFERENCES Assistente_Social(CPF),
    CONSTRAINT fk_Médico_Atendimento FOREIGN KEY (CPF_Médico) REFERENCES Médico(CPF)
);


CREATE TABLE Turno(
    ID_Turno SERIAL PRIMARY KEY,
    Dia_da_Semana VARCHAR(10) NOT NULL CHECK (Dia_da_Semana IN ('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo')),
    Hora_Chegada TIMESTAMP NOT NULL,
    Hora_Saída TIMESTAMP NOT NULL
);


CREATE TABLE Turno_Médico (
    ID_Turno INT,
    CPF_Médico CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Médico),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Médico) REFERENCES Médico(CPF)
);


CREATE TABLE Turno_Dentista (
    ID_Turno INT,
    CPF_Dentista CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Dentista),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Dentista) REFERENCES Dentista(CPF)
);


CREATE TABLE Turno_Assistente_Social (
    ID_Turno INT,
    CPF_Assistente_Social CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Assistente_Social),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Assistente_Social) REFERENCES Assistente_Social(CPF)
);


CREATE TABLE Turno_Profissional_Enfermagem (
    ID_Turno INT,
    CPF_Profissional CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Profissional),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Profissional) REFERENCES Profissional_de_Enfermagem(CPF)
);


CREATE TABLE Turno_Técnico_de_Radiologia (
    ID_Turno INT,
    CPF_Técnico CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Técnico),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Técnico) REFERENCES Técnico_de_Radiologia(CPF)
);


CREATE TABLE Turno_Colaborador_Geral (
    ID_Turno INT,
    CPF_Colaborador CHAR(11),
    PRIMARY KEY (ID_Turno, CPF_Colaborador),
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno),
    FOREIGN KEY (CPF_Colaborador) REFERENCES Colaborador_Geral(CPF)
);
