-- Inicia uma transação. Se algo der errado, nada será salvo.
BEGIN;

-- NÍVEL 0: TABELAS QUE NÃO DEPENDEM DE NENHUMA OUTRA --

-- Pacientes
INSERT INTO Paciente (CPF, Nome, Rg, Endereço, Data_de_Nascimento, Telefone) VALUES
('11111111111', 'Ana Silva', '123456789', 'Rua A, 10', '1990-05-15', '11988887777'),
('22222222222', 'Beto Costa', '987654321', 'Av. B, 20', '1985-03-20', '11977776666');

-- Profissionais de Saúde (Médicos, Dentistas, etc.)
INSERT INTO Médico (CPF, Nome, Telefone, CRM, RQE) VALUES
('55555555555', 'Dr. Carlos', '11955554444', 'CRM-SP 123', '123');

INSERT INTO Dentista (CPF, Nome, Telefone, CRO) VALUES
('33333333333', 'Dr. Diana', '11944443333', 'CRO-SP 456');

INSERT INTO Assistente_Social (CPF, Nome, Telefone, CRESS) VALUES
('44444444444', 'Sofia Lima', '11966665555', '7890');

INSERT INTO Sala_de_Raio_X (ID_Sala_Raio_X) VALUES (DEFAULT); -- Insere o ID 1 (SERIAL)

INSERT INTO Técnico_de_Radiologia (CPF, Nome, Telefone, CRTR, ID_Sala_de_Raio_X) VALUES
('77777777777', 'Roger Dias', '11933332222', 'SP 1', 1);


INSERT INTO Sala (Tipo) VALUES
('Triagem'),   -- ID 1
('Gesso'),     -- ID 2
('Coleta'),    -- ID 3
('Medicação'); -- ID 4

INSERT INTO Profissional_de_Enfermagem (CPF, Nome, Telefone, COREN, Categoria, ID_Sala) VALUES
('88888888888', 'Elisa Mendes', '11922221111', 'COREN-SP 123', 'E', 1), -- Enfermeira na Triagem
('99999999999', 'Fabio Nunes', '11911110000', 'COREN-SP 456', 'T', 1); -- Técnico na Triagem

INSERT INTO Colaborador_Geral (CPF, Nome, Telefone, Função) VALUES
('66666666666', 'Geraldo Reis', '11900001111', 'Limpeza');

-- Infraestrutura (Leitos, Equipamentos, etc.)
INSERT INTO Leito (Tipo) VALUES
('Comum'),      -- ID 1
('Emergência'); -- ID 2

INSERT INTO Equipamento_Raio_X (Nome, Última_Manutenção) VALUES
('Siemens Raio-X Fixo', '2025-10-01');

INSERT INTO Medicamento (Nome) VALUES
('Dipirona 500mg'),
('Amoxicilina 250mg'),
('Soro Fisiológico 0.9%');

INSERT INTO Consultório (Tipo) VALUES
('Geral'),        -- ID 1
('Odontológico'); -- ID 2

INSERT INTO Turno (Dia_da_Semana, Hora_Chegada, Hora_Saída) VALUES
('Segunda', '2025-11-10 08:00:00', '2025-11-10 14:00:00'); -- ID 1 (Manhã)

-- NÍVEL 1: TABELAS QUE DEPENDEM DO NÍVEL 0 --

-- Detalhes do Paciente
INSERT INTO Condicoes_Paciente (Condicoes, CPF_Paciente) VALUES
('Hipertensão', '11111111111');

INSERT INTO Alergias_Paciente (Alergias, CPF_Paciente) VALUES
('Pólen', '11111111111');

-- Alocação de Paciente em Leito
INSERT INTO Paciete_Ocupa_Leito (Data_de_Entrada, CPF_Paciente, ID_Leito) VALUES
('2025-11-10', '11111111111', 2); -- Ana Silva no leito de emergência

-- Agendamento de Turnos dos Profissionais
INSERT INTO Turno_Médico (ID_Turno, CPF_Médico) VALUES
(1, '55555555555'); -- Dr. Carlos no turno da manhã

INSERT INTO Turno_Dentista (ID_Turno, CPF_Dentista) VALUES
(1, '33333333333'); -- Dr. Diana no turno da manhã

INSERT INTO Turno_Profissional_Enfermagem (ID_Turno, CPF_Profissional) VALUES
(1, '88888888888'); -- Enf. Elisa no turno da manhã

INSERT INTO Turno_Técnico_de_Radiologia (ID_Turno, CPF_Técnico) VALUES
(1, '77777777777'); -- Tec. Roger no turno da manhã

INSERT INTO turno_colaborador_geral (ID_Turno, cpf_colaborador ) VALUES
(1, '66666666666');

INSERT INTO turno_assistente_social (id_turno, cpf_assistente_social) VALUES
(1, '44444444444');

-- Alocação de Consultórios
INSERT INTO Uso_Consultório (ID_Consultório, ID_Turno, CPF_Médico) VALUES
(1, 1, '55555555555'); -- Dr. Carlos no Consultório Geral no turno da manhã

-- NÍVEL 2: ATENDIMENTO (Depende de Pacientes e Profissionais) --

-- Atendimento 1: Ana Silva (caso médico grave)
INSERT INTO Atendimento (
    Data_Hora_Entrada, CID, Observações, Temperatura, Pressão_Arterial, Nível_de_Risco, Frequência_Cardíaca,
    CPF_Paciente, CPF_Médico, CPF_Técnico_de_Radiologia, CPF_Profissional_de_Enfermagem
) VALUES (
    '2025-11-10 09:15:00', 'I10', 'Paciente com pico de pressão.', 36, '180/110', 'Vermelho', 95,
    '11111111111', '55555555555', '77777777777', '88888888888'
); -- ID 1 (SERIAL)

-- Atendimento 2: Beto Costa (caso odontológico simples)
INSERT INTO Atendimento (
    Data_Hora_Entrada, Data_Hora_Saída, CID, Observações, Temperatura, Pressão_Arterial, Nível_de_Risco, Frequência_Cardíaca,
    CPF_Paciente, CPF_Dentista, CPF_Profissional_de_Enfermagem
) VALUES (
    '2025-11-10 10:30:00', '2025-11-10 11:15:00', 'K02.1', 'Cárie no molar 36.', 36, '120/80', 'Verde', 70,
    '22222222222', '33333333333', '99999999999'
); -- ID 2 (SERIAL)

-- NÍVEL 3: DEPENDÊNCIAS DO ATENDIMENTO --

-- Transferência para Ana Silva (Atendimento 1)
INSERT INTO Transferência (Data_Transferência, Justificativa, Status_Tranferência, Transporte, ID_Atendimento) VALUES
('2025-11-10', 'Risco cardíaco, necessita de CTI.', 'Aguardando', 'Ambulância', 1); -- ID 1 (SERIAL)

-- Coleta de Exames para Ana Silva (Atendimento 1)
INSERT INTO Amostra_Coletada (Tipo, Exame, Previsão_Liberação, ID_Atendimento) VALUES
('Sangue', 'Hemograma Completo', '2025-11-10 12:00:00', 1);

-- Raio-X para Ana Silva (Atendimento 1)
INSERT INTO Atendimento_Usa_Equipamento (ID_Atendimento, ID_Equipamento) VALUES
(1, 1);

-- Medicação para Ana Silva (Atendimento 1)
INSERT INTO Atendimento_Usa_Medicamento (ID_Atendimento, Nome_Medicamento) VALUES
(1, 'Dipirona 500mg');

-- NÍVEL 4: DEPENDÊNCIAS DA TRANSFERÊNCIA --

-- Hospital para onde Ana Silva será transferida
INSERT INTO Hospital (Nome, Endereço, Telefone, ID_Transferência) VALUES
('Hospital Santa Casa', 'Rua C, 300', '1133332222', 1);


-- Confirma a transação
COMMIT;