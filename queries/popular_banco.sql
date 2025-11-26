-- ============================================================

-- 1. INFRAESTRUTURA BÁSICA (Hospitais, Salas, Leitos, Equipamentos, Remedios)

-- ============================================================


-- Tabela Hospital (25 entradas)

INSERT INTO Hospital (Nome, Endereço, Telefone) VALUES

('Hospital das Clínicas', 'Av. Paulista, 100', '1133330001'),

('Santa Casa', 'Rua da Misericórdia, 50', '1133330002'),

('Hospital São Luiz', 'Rua do Luxo, 200', '1133330003'),

('Hospital Alvorada', 'Av. Brasil, 500', '1133330004'),

('Hospital Geral de Osasco', 'Rua da Estação, 10', '1133330005'),

('Hospital da Luz', 'Rua Escura, 99', '1133330006'),

('Maternidade Pro Matre', 'Av. Paulista, 200', '1133330007'),

('Hospital 9 de Julho', 'Rua Peixoto, 30', '1133330008'),

('Hospital Sírio-Libanês', 'Rua Dona Adma, 1', '1133330009'),

('Hospital Albert Einstein', 'Av. Morumbi, 700', '1133330010'),

('UPA 24h Centro', 'Rua Central, 5', '1133330011'),

('UPA 24h Norte', 'Av. Norte, 1000', '1133330012'),

('UPA 24h Sul', 'Av. Sul, 2000', '1133330013'),

('Hospital Infantil Sabará', 'Rua das Crianças, 12', '1133330014'),

('Hospital do Coração', 'Rua do Coração, 88', '1133330015'),

('Hospital Santa Catarina', 'Av. Paulista, 300', '1133330016'),

('Hospital Samaritano', 'Rua Conselheiro, 40', '1133330017'),
('Hospital Leforte', 'Rua dos Fortes, 50', '1133330018'),
('Hospital Nipo-Brasileiro', 'Rua Japão, 10', '1133330019'),
('Hospital Cema', 'Rua dos Olhos, 20', '1133330020'),
('Hospital Cruz Azul', 'Av. da Polícia, 190', '1133330021'),
('Hospital Militar', 'Av. do Exército, 50', '1133330022'),
('Hospital Universitário', 'Cidade Universitária', '1133330023'),
('Hospital Regional', 'Estrada Velha, 400', '1133330024'),
('Hospital da Mulher', 'Rua das Rosas, 15', '1133330025');

-- Tabela Sala_de_Raio_X (25 entradas)
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; -- Repetir 25x
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES; INSERT INTO Sala_de_Raio_X DEFAULT VALUES;
INSERT INTO Sala_de_Raio_X DEFAULT VALUES;

-- Tabela Sala (Genéricas) - Misturando tipos
INSERT INTO Sala (Tipo) VALUES 
('Gesso'), ('Triagem'), ('Coleta'), ('Medicação'), ('Medicação'),
('Triagem'), ('Triagem'), ('Coleta'), ('Gesso'), ('Medicação'),
('Triagem'), ('Coleta'), ('Medicação'), ('Gesso'), ('Triagem'),
('Coleta'), ('Medicação'), ('Triagem'), ('Triagem'), ('Gesso'),
('Coleta'), ('Medicação'), ('Triagem'), ('Coleta'), ('Medicação');

-- Tabela Leito - Misturando Comum e Emergência
INSERT INTO Leito (Tipo) VALUES
('Comum'), ('Comum'), ('Emergência'), ('Comum'), ('Emergência'),
('Comum'), ('Comum'), ('Comum'), ('Emergência'), ('Emergência'),
('Comum'), ('Comum'), ('Emergência'), ('Comum'), ('Comum'),
('Emergência'), ('Emergência'), ('Comum'), ('Comum'), ('Emergência'),
('Comum'), ('Comum'), ('Comum'), ('Emergência'), ('Emergência');

-- Tabela Equipamento_Raio_X 
-- CASO INTERESSANTE: Alguns com manutenção muito antiga (risco operacional)
INSERT INTO Equipamento_Raio_X (Nome, Última_Manutenção) VALUES
('Raio-X Fixo A', '2023-12-01'), ('Raio-X Móvel B', '2024-01-15'), ('Tomógrafo C', '2020-05-20'), -- Manutenção atrasada!
('Ressonância D', '2024-02-10'), ('Raio-X Fixo E', '2024-03-01'), ('Mamógrafo F', '2023-11-20'),
('Raio-X Móvel G', '2024-01-05'), ('Raio-X Fixo H', '2022-08-15'), -- Manutenção antiga
('Tomógrafo I', '2024-03-15'), ('Ressonância J', '2024-02-28'), ('Raio-X Fixo K', '2024-01-10'),
('Raio-X Móvel L', '2024-02-05'), ('Mamógrafo M', '2024-03-10'), ('Raio-X Fixo N', '2023-10-30'),
('Raio-X Fixo O', '2024-01-20'), ('Tomógrafo P', '2024-02-15'), ('Ressonância Q', '2024-03-05'),
('Raio-X Móvel R', '2021-06-12'), -- Manutenção atrasada!
('Mamógrafo S', '2024-02-25'), ('Raio-X Fixo T', '2024-01-08'), ('Raio-X Fixo U', '2024-03-18'),
('Tomógrafo V', '2024-02-22'), ('Ressonância W', '2024-01-25'), ('Raio-X Móvel X', '2024-03-12'),
('Raio-X Fixo Y', '2024-02-18');

-- Tabela Medicamento
INSERT INTO Medicamento (Nome) VALUES
('Dipirona'), ('Paracetamol'), ('Ibuprofeno'), ('Morfina'), ('Tramadol'),
('Diazepam'), ('Buscopan'), ('Plasil'), ('Ondansetrona'), ('Ceftriaxona'),
('Amoxicilina'), ('Azitromicina'), ('Insulina'), ('Adrenalina'), ('Atropina'),
('Furosemida'), ('Hidrocortisona'), ('Prednisona'), ('Omeprazol'), ('Pantoprazol'),
('Losartana'), ('Enalapril'), ('Atenolol'), ('Metformina'), ('Simeticona'), (‘Dramin’), (‘AAS’), (‘Colírio’);

-- Tabela Consultório
INSERT INTO Consultório (Tipo) VALUES
('Geral'), ('Odontológico'), ('Geral'), ('Geral'), ('Odontológico'),
('Geral'), ('Geral'), ('Odontológico'), ('Geral'), ('Geral'),
('Geral'), ('Odontológico'), ('Geral'), ('Geral'), ('Odontológico'),
('Geral'), ('Geral'), ('Geral'), ('Odontológico'), ('Geral'),
('Geral'), ('Geral'), ('Odontológico'), ('Geral'), ('Geral');

-- ============================================================
-- 2. PESSOAS (Profissionais e Pacientes)
-- ============================================================

-- Pacientes (30 entradas para garantir)
INSERT INTO Paciente (Rg, Endereço, CPF, Data_de_Nascimento, Nome, Telefone) VALUES
('123456789', 'Rua A, 1', '11111111111', '1990-01-01', 'Ana Silva', '11999990001'),
('223456789', 'Rua B, 2', '22222222222', '1985-05-15', 'Bruno Souza', '11999990002'),
('323456789', 'Rua C, 3', '33333333333', '2000-10-20', 'Carla Dias', '11999990003'),
('423456789', 'Rua D, 4', '44444444444', '1950-12-25', 'Daniel Lima', '11999990004'),
('523456789', 'Rua E, 5', '55555555555', '1978-03-30', 'Elena Costa', '11999990005'),
('623456789', 'Rua F, 6', '66666666666', '2015-07-07', 'Fábio Melo', '11999990006'), -- Criança
('723456789', 'Rua G, 7', '77777777777', '1995-09-09', 'Gabriela Ro', '11999990007'),
('823456789', 'Rua H, 8', '88888888888', '1960-02-14', 'Hugo Alves', '11999990008'),
('923456789', 'Rua I, 9', '99999999999', '1988-11-11', 'Igor Santos', '11999990009'),
('023456789', 'Rua J, 10', '00000000000', '1945-06-18', 'Julia Faria', '11999990010'), -- Idosa
('113456789', 'Rua K, 11', '10101010101', '2001-01-01', 'Kaio Pinto', '11999990011'),
('213456789', 'Rua L, 12', '12121212121', '1999-12-31', 'Lara Croft', '11999990012'),
('313456789', 'Rua M, 13', '13131313131', '1980-08-08', 'Mario Bros', '11999990013'),
('413456789', 'Rua N, 14', '14141414141', '1992-04-04', 'Nair Belo', '11999990014'),
('513456789', 'Rua O, 15', '15151515151', '1975-05-05', 'Olavo Bilac', '11999990015'),
('613456789', 'Rua P, 16', '16161616161', '2010-10-10', 'Paula Toller', '11999990016'),
('713456789', 'Rua Q, 17', '17171717171', '1955-01-20', 'Quincas Borba', '11999990017'),
('813456789', 'Rua R, 18', '18181818181', '1996-03-15', 'Raul Seixas', '11999990018'),
('913456789', 'Rua S, 19', '19191919191', '1983-07-22', 'Sandra Annen', '11999990019'),
('013456789', 'Rua T, 20', '20202020202', '2020-02-20', 'Tadeu Schimt', '11999990020'),
('122456789', 'Rua U, 21', '21212121212', '1968-09-30', 'Ubirajara', '11999990021'),
('222456789', 'Rua V, 22', '23232323232', '1991-11-01', 'Vera Fisher', '11999990022'),
('322456789', 'Rua W, 23', '24242424242', '1970-12-12', 'Wagner Moura', '11999990023'),
('422456789', 'Rua X, 24', '25252525252', '1989-06-06', 'Xuxa Meneghel', '11999990024'),
('522456789', 'Rua Y, 25', '26262626262', '2005-05-25', 'Yuri Gagarin', '11999990025'),
('622456789', 'Rua Z, 26', '27272727272', '1994-04-14', 'Zeca Pagodin', '11999990026');

-- Condições e Alergias
INSERT INTO Condicoes_Paciente (Condicoes, CPF_Paciente) VALUES
('Diabetes Tipo 1', '11111111111'), ('Hipertensão', '22222222222'), ('Asma', '33333333333'),
('Cardiopatia', '44444444444'), ('Obesidade', '55555555555'), ('Renal Crônico', '88888888888'),
('Diabetes Tipo 2', '00000000000'), ('Artrite', '10101010101'), ('Bronquite', '12121212121'),
('Depressão', '13131313131'), ('Ansiedade', '14141414141'), ('Gastrite', '15151515151'),
('Enxaqueca', '16161616161'), ('Hérnia de Disco', '17171717171'), ('Lúpus', '18181818181'),
('Osteoporose', '19191919191'), ('Tireoidite', '20202020202'), ('Anemia', '21212121212'),
('Epilepsia', '23232323232'), ('Alzheimer', '24242424242'), ('Parkinson', '25252525252'),
('HIV Positivo', '26262626262'), ('Hepatite B', '27272727272'), ('Câncer em Remissão', '66666666666'),
('Autismo', '77777777777');

INSERT INTO Alergias_Paciente (Alergias, CPF_Paciente) VALUES
('Dipirona', '11111111111'), ('Penicilina', '22222222222'), ('Lactose', '33333333333'),
('Camarão', '44444444444'), ('Látex', '55555555555'), ('Amendoim', '66666666666'),
('Poeira', '77777777777'), ('Gatos', '88888888888'), ('Ibuprofeno', '99999999999'),
('Sulfa', '00000000000'), ('Glúten', '10101010101'), ('Ovo', '12121212121'),
('Abelha', '13131313131'), ('Mofo', '14141414141'), ('AAS', '15151515151'),
('Contrastes Iodados', '16161616161'), ('Níquel', '17171717171'), ('Soja', '18181818181'),
('Peixe', '19191919191'), ('Trigo', '20202020202'), ('Cães', '21212121212'),
('Ácaros', '23232323232'), ('Perfume', '24242424242'), ('Cloro', '25252525252'),
('Aines', '26262626262');

-- Médicos (25 entradas)
INSERT INTO Médico (Nome, CPF, Telefone, CRM, RQE) VALUES
('Dr. House', 'DOC11111111', '11888880001', 'CRM1001', '001'),
('Dra. Grey', 'DOC22222222', '11888880002', 'CRM1002', '002'),
('Dr. Shepherd', 'DOC33333333', '11888880003', 'CRM1003', '003'),
('Dra. Yang', 'DOC44444444', '11888880004', 'CRM1004', '004'),
('Dr. Karev', 'DOC55555555', '11888880005', 'CRM1005', '005'),
('Dr. Strange', 'DOC66666666', '11888880006', 'CRM1006', '006'),
('Dra. Quinn', 'DOC77777777', '11888880007', 'CRM1007', '007'),
('Dr. Dolittle', 'DOC88888888', '11888880008', 'CRM1008', '008'),
('Dra. Foster', 'DOC99999999', '11888880009', 'CRM1009', '009'),
('Dr. Jekyll', 'DOC00000000', '11888880010', 'CRM1010', '010'),
('Dr. Oz', 'DOC12121212', '11888880011', 'CRM1011', '011'),
('Dra. Bones', 'DOC13131313', '11888880012', 'CRM1012', '012'),
('Dr. Watson', 'DOC14141414', '11888880013', 'CRM1013', '013'),
('Dra. Cuddy', 'DOC15151515', '11888880014', 'CRM1014', '014'),
('Dr. Foreman', 'DOC16161616', '11888880015', 'CRM1015', '015'),
('Dra. Cameron', 'DOC17171717', '11888880016', 'CRM1016', '016'),
('Dr. Chase', 'DOC18181818', '11888880017', 'CRM1017', '017'),
('Dra. Bailey', 'DOC19191919', '11888880018', 'CRM1018', '018'),
('Dr. Webber', 'DOC20202020', '11888880019', 'CRM1019', '019'),
('Dra. Torres', 'DOC21212121', '11888880020', 'CRM1020', '020'),
('Dr. Sloan', 'DOC23232323', '11888880021', 'CRM1021', '021'),
('Dra. Altman', 'DOC24242424', '11888880022', 'CRM1022', '022'),
('Dr. Hunt', 'DOC25252525', '11888880023', 'CRM1023', '023'),
('Dra. Pierce', 'DOC26262626', '11888880024', 'CRM1024', '024'),
('Dr. Avery', 'DOC27272727', '11888880025', 'CRM1025', '025');

-- Dentistas (25 entradas)
INSERT INTO Dentista (Nome, CPF, Telefone, CRO) VALUES
('Dentista 1', 'DEN00000001', '1177770001', 'CRO001'),
('Dentista 2', 'DEN00000002', '1177770002', 'CRO002'),
('Dentista 3', 'DEN00000003', '1177770003', 'CRO003'),
('Dentista 4', 'DEN00000004', '1177770004', 'CRO004'),
('Dentista 5', 'DEN00000005', '1177770005', 'CRO005'),
('Dentista 6', 'DEN00000006', '1177770006', 'CRO006'),
('Dentista 7', 'DEN00000007', '1177770007', 'CRO007'),
('Dentista 8', 'DEN00000008', '1177770008', 'CRO008'),
('Dentista 9', 'DEN00000009', '1177770009', 'CRO009'),
('Dentista 10', 'DEN00000010', '1177770010', 'CRO010'),
('Dentista 11', 'DEN00000011', '1177770011', 'CRO011'),
('Dentista 12', 'DEN00000012', '1177770012', 'CRO012'),
('Dentista 13', 'DEN00000013', '1177770013', 'CRO013'),
('Dentista 14', 'DEN00000014', '1177770014', 'CRO014'),
('Dentista 15', 'DEN00000015', '1177770015', 'CRO015'),
('Dentista 16', 'DEN00000016', '1177770016', 'CRO016'),
('Dentista 17', 'DEN00000017', '1177770017', 'CRO017'),
('Dentista 18', 'DEN00000018', '1177770018', 'CRO018'),
('Dentista 19', 'DEN00000019', '1177770019', 'CRO019'),
('Dentista 20', 'DEN00000020', '1177770020', 'CRO020'),
('Dentista 21', 'DEN00000021', '1177770021', 'CRO021'),
('Dentista 22', 'DEN00000022', '1177770022', 'CRO022'),
('Dentista 23', 'DEN00000023', '1177770023', 'CRO023'),
('Dentista 24', 'DEN00000024', '1177770024', 'CRO024'),
('Dentista 25', 'DEN00000025', '1177770025', 'CRO025');

-- Assistentes Sociais (25 entradas)
INSERT INTO Assistente_Social (Nome, CPF, Telefone, CRESS) VALUES
('Assistente 1', 'ASS00000001', '1166660001', 'CRE001'),
('Assistente 2', 'ASS00000002', '1166660002', 'CRE002'),
('Assistente 3', 'ASS00000003', '1166660003', 'CRE003'),
('Assistente 4', 'ASS00000004', '1166660004', 'CRE004'),
('Assistente 5', 'ASS00000005', '1166660005', 'CRE005'),
('Assistente 6', 'ASS00000006', '1166660006', 'CRE006'),
('Assistente 7', 'ASS00000007', '1166660007', 'CRE007'),
('Assistente 8', 'ASS00000008', '1166660008', 'CRE008'),
('Assistente 9', 'ASS00000009', '1166660009', 'CRE009'),
('Assistente 10', 'ASS00000010', '1166660010', 'CRE010'),
('Assistente 11', 'ASS00000011', '1166660011', 'CRE011'),
('Assistente 12', 'ASS00000012', '1166660012', 'CRE012'),
('Assistente 13', 'ASS00000013', '1166660013', 'CRE013'),
('Assistente 14', 'ASS00000014', '1166660014', 'CRE014'),
('Assistente 15', 'ASS00000015', '1166660015', 'CRE015'),
('Assistente 16', 'ASS00000016', '1166660016', 'CRE016'),
('Assistente 17', 'ASS00000017', '1166660017', 'CRE017'),
('Assistente 18', 'ASS00000018', '1166660018', 'CRE018'),
('Assistente 19', 'ASS00000019', '1166660019', 'CRE019'),
('Assistente 20', 'ASS00000020', '1166660020', 'CRE020'),
('Assistente 21', 'ASS00000021', '1166660021', 'CRE021'),
('Assistente 22', 'ASS00000022', '1166660022', 'CRE022'),
('Assistente 23', 'ASS00000023', '1166660023', 'CRE023'),
('Assistente 24', 'ASS00000024', '1166660024', 'CRE024'),
('Assistente 25', 'ASS00000025', '1166660025', 'CRE025');

-- Técnicos de Radiologia (Alocados em salas de raio-x)
INSERT INTO Técnico_de_Radiologia (Nome, CPF, Telefone, CRTR, ID_Sala_de_Raio_X) VALUES
('Tec Rad 1', 'RAD00000001', '1155550001', 'CRTR001', 1),
('Tec Rad 2', 'RAD00000002', '1155550002', 'CRTR002', 1), -- Dois na mesma sala
('Tec Rad 3', 'RAD00000003', '1155550003', 'CRTR003', 2),
('Tec Rad 4', 'RAD00000004', '1155550004', 'CRTR004', 3),
('Tec Rad 5', 'RAD00000005', '1155550005', 'CRTR005', 4),
('Tec Rad 6', 'RAD00000006', '1155550006', 'CRTR006', 5),
('Tec Rad 7', 'RAD00000007', '1155550007', 'CRTR007', 6),
('Tec Rad 8', 'RAD00000008', '1155550008', 'CRTR008', 7),
('Tec Rad 9', 'RAD00000009', '1155550009', 'CRTR009', 8),
('Tec Rad 10', 'RAD00000010', '1155550010', 'CRTR010', 9),
('Tec Rad 11', 'RAD00000011', '1155550011', 'CRTR011', 10),
('Tec Rad 12', 'RAD00000012', '1155550012', 'CRTR012', 11),
('Tec Rad 13', 'RAD00000013', '1155550013', 'CRTR013', 12),
('Tec Rad 14', 'RAD00000014', '1155550014', 'CRTR014', 13),
('Tec Rad 15', 'RAD00000015', '1155550015', 'CRTR015', 14),
('Tec Rad 16', 'RAD00000016', '1155550016', 'CRTR016', 15),
('Tec Rad 17', 'RAD00000017', '1155550017', 'CRTR017', 16),
('Tec Rad 18', 'RAD00000018', '1155550018', 'CRTR018', 17),
('Tec Rad 19', 'RAD00000019', '1155550019', 'CRTR019', 18),
('Tec Rad 20', 'RAD00000020', '1155550020', 'CRTR020', 19),
('Tec Rad 21', 'RAD00000021', '1155550021', 'CRTR021', 20),
('Tec Rad 22', 'RAD00000022', '1155550022', 'CRTR022', 21),
('Tec Rad 23', 'RAD00000023', '1155550023', 'CRTR023', 22),
('Tec Rad 24', 'RAD00000024', '1155550024', 'CRTR024', 23),
('Tec Rad 25', 'RAD00000025', '1155550025', 'CRTR025', 24);
-- Nota: A sala 25 ficou vazia (nenhum técnico alocado fixo)

-- Profissional de Enfermagem (E=Enfermeiro, T=Tecnico)
-- Alguns sem sala (volantes)
INSERT INTO Profissional_de_Enfermagem (Nome, CPF, Telefone, COREN, Categoria, ID_Sala) VALUES
('Enf 1', 'ENF00000001', '1144440001', 'COREN001', 'E', 1),
('Enf 2', 'ENF00000002', '1144440002', 'COREN002', 'E', 1),
('Tec Enf 3', 'ENF00000003', '1144440003', 'COREN003', 'T', 2),
('Enf 4', 'ENF00000004', '1144440004', 'COREN004', 'E', 3),
('Tec Enf 5', 'ENF00000005', '1144440005', 'COREN005', 'T', 4),
('Enf 6', 'ENF00000006', '1144440006', 'COREN006', 'E', 5),
('Tec Enf 7', 'ENF00000007', '1144440007', 'COREN007', 'T', 6),
('Enf 8', 'ENF00000008', '1144440008', 'COREN008', 'E', NULL), -- Volante
('Tec Enf 9', 'ENF00000009', '1144440009', 'COREN009', 'T', 8),
('Enf 10', 'ENF00000010', '1144440010', 'COREN010', 'E', 9),
('Tec Enf 11', 'ENF00000011', '1144440011', 'COREN011', 'T', NULL), -- Volante
('Enf 12', 'ENF00000012', '1144440012', 'COREN012', 'E', 10),
('Tec Enf 13', 'ENF00000013', '1144440013', 'COREN013', 'T', 11),
('Enf 14', 'ENF00000014', '1144440014', 'COREN014', 'E', 12),
('Tec Enf 15', 'ENF00000015', '1144440015', 'COREN015', 'T', 13),
('Enf 16', 'ENF00000016', '1144440016', 'COREN016', 'E', 14),
('Tec Enf 17', 'ENF00000017', '1144440017', 'COREN017', 'T', 15),
('Enf 18', 'ENF00000018', '1144440018', 'COREN018', 'E', 16),
('Tec Enf 19', 'ENF00000019', '1144440019', 'COREN019', 'T', 17),
('Enf 20', 'ENF00000020', '1144440020', 'COREN020', 'E', 18),
('Tec Enf 21', 'ENF00000021', '1144440021', 'COREN021', 'T', 19),
('Enf 22', 'ENF00000022', '1144440022', 'COREN022', 'E', 20),
('Tec Enf 23', 'ENF00000023', '1144440023', 'COREN023', 'T', 21),
('Enf 24', 'ENF00000024', '1144440024', 'COREN024', 'E', 22),
('Tec Enf 25', 'ENF00000025', '1144440025', 'COREN025', 'T', 23);

-- Colaborador Geral
INSERT INTO Colaborador_Geral (Nome, CPF, Telefone, Função) VALUES
('Zelador 1', 'GEL00000001', '1133330001', 'Limpeza'),
('Zelador 2', 'GEL00000002', '1133330002', 'Limpeza'),
('Recepcionista 1', 'GEL00000003', '1133330003', 'Recepção'),
('Segurança 1', 'GEL00000004', '1133330004', 'Segurança'),
('Cozinheiro 1', 'GEL00000005', '1133330005', 'Cozinha'),
('Zelador 3', 'GEL00000006', '1133330006', 'Limpeza'),
('Recepcionista 2', 'GEL00000007', '1133330007', 'Recepção'),
('Segurança 2', 'GEL00000008', '1133330008', 'Segurança'),
('Cozinheiro 2', 'GEL00000009', '1133330009', 'Cozinha'),
('TI 1', 'GEL00000010', '1133330010', 'Suporte Técnico'),
('TI 2', 'GEL00000011', '1133330011', 'Suporte Técnico'),
('Zelador 4', 'GEL00000012', '1133330012', 'Limpeza'),
('Recepcionista 3', 'GEL00000013', '1133330013', 'Recepção'),
('Segurança 3', 'GEL00000014', '1133330014', 'Segurança'),
('Cozinheiro 3', 'GEL00000015', '1133330015', 'Cozinha'),
('Motorista 1', 'GEL00000016', '1133330016', 'Transporte'),
('Motorista 2', 'GEL00000017', '1133330017', 'Transporte'),
('Zelador 5', 'GEL00000018', '1133330018', 'Limpeza'),
('Recepcionista 4', 'GEL00000019', '1133330019', 'Recepção'),
('Segurança 4', 'GEL00000020', '1133330020', 'Segurança'),
('Cozinheiro 4', 'GEL00000021', '1133330021', 'Cozinha'),
('TI 3', 'GEL00000022', '1133330022', 'Suporte Técnico'),
('Zelador 6', 'GEL00000023', '1133330023', 'Limpeza'),
('Recepcionista 5', 'GEL00000024', '1133330024', 'Recepção'),
('Segurança 5', 'GEL00000025', '1133330025', 'Segurança');

-- ============================================================
-- 3. TURNOS (Simulando)
-- ============================================================

INSERT INTO Turno (Dia_da_Semana, Hora_Chegada, Hora_Saída) VALUES
('Segunda', '2024-01-01 08:00:00', '2024-01-01 18:00:00'), -- 1
('Segunda', '2024-01-01 18:00:00', '2024-01-02 06:00:00'), -- 2 (Noturno)
('Terça', '2024-01-02 08:00:00', '2024-01-02 18:00:00'),   -- 3
('Terça', '2024-01-02 18:00:00', '2024-01-03 06:00:00'),   -- 4 (Noturno)
('Quarta', '2024-01-03 08:00:00', '2024-01-03 18:00:00'),  -- 5
('Quarta', '2024-01-03 18:00:00', '2024-01-04 06:00:00'),  -- 6 (Noturno)
('Quinta', '2024-01-04 08:00:00', '2024-01-04 18:00:00'),  -- 7
('Quinta', '2024-01-04 18:00:00', '2024-01-05 06:00:00'),  -- 8 (Noturno)
('Sexta', '2024-01-05 08:00:00', '2024-01-05 18:00:00'),   -- 9
('Sexta', '2024-01-05 18:00:00', '2024-01-06 06:00:00'),   -- 10 (Noturno)
('Sábado', '2024-01-06 08:00:00', '2024-01-06 20:00:00'),  -- 11 (Plantão)
('Domingo', '2024-01-07 08:00:00', '2024-01-07 20:00:00'), -- 12 (Plantão)
-- Repetindo turnos para encher tabela
('Segunda', '2024-01-08 08:00:00', '2024-01-08 18:00:00'),
('Segunda', '2024-01-08 18:00:00', '2024-01-09 06:00:00'),
('Terça', '2024-01-09 08:00:00', '2024-01-09 18:00:00'),
('Terça', '2024-01-09 18:00:00', '2024-01-10 06:00:00'),
('Quarta', '2024-01-10 08:00:00', '2024-01-10 18:00:00'),
('Quarta', '2024-01-10 18:00:00', '2024-01-11 06:00:00'),
('Quinta', '2024-01-11 08:00:00', '2024-01-11 18:00:00'),
('Quinta', '2024-01-11 18:00:00', '2024-01-12 06:00:00'),
('Sexta', '2024-01-12 08:00:00', '2024-01-12 18:00:00'),
('Sexta', '2024-01-12 18:00:00', '2024-01-13 06:00:00'),
('Sábado', '2024-01-13 08:00:00', '2024-01-13 20:00:00'),
('Domingo', '2024-01-14 08:00:00', '2024-01-14 20:00:00'),
('Segunda', '2024-01-15 08:00:00', '2024-01-15 18:00:00');

-- Associações de Turno (Alguns exemplos para popular)
INSERT INTO Turno_Médico (ID_Turno, CPF_Médico) VALUES 
(1, 'DOC11111111'), (2, 'DOC22222222'), (1, 'DOC33333333'), (3, 'DOC11111111'), (4, 'DOC44444444');
INSERT INTO Turno_Dentista (ID_Turno, CPF_Dentista) VALUES 
(1, 'DEN00000001'), (3, 'DEN00000002'), (5, 'DEN00000001');
INSERT INTO Turno_Assistente_Social (ID_Turno, CPF_Assistente_Social) VALUES 
(1, 'ASS00000001'), (2, 'ASS00000002');
INSERT INTO Turno_Profissional_Enfermagem (ID_Turno, CPF_Profissional) VALUES 
(1, 'ENF00000001'), (1, 'ENF00000002'), (2, 'ENF00000003');
INSERT INTO Turno_Técnico_de_Radiologia (ID_Turno, CPF_Técnico) VALUES 
(1, 'RAD00000001'), (2, 'RAD00000002');
INSERT INTO Turno_Colaborador_Geral (ID_Turno, CPF_Colaborador) VALUES 
(1, 'GEL00000001'), (2, 'GEL00000002');

-- Uso Consultório (Alocando profissionais aos consultórios nos turnos)
INSERT INTO Uso_Consultório (ID_Consultório, ID_Turno, CPF_Dentista, CPF_Médico, CPF_Assistente_Social) VALUES
(1, 1, NULL, 'DOC11111111', NULL), -- Médico no consultorio 1 turno 1
(2, 1, 'DEN00000001', NULL, NULL), -- Dentista no consultorio 2 turno 1
(1, 2, NULL, 'DOC22222222', NULL), -- Médico diferente no consultorio 1 turno 2
(3, 1, NULL, NULL, 'ASS00000001'); -- Assistente no consultorio 3

-- ============================================================
-- 4. O HUB PRINCIPAL: ATENDIMENTO
-- ============================================================
-- Casos:
-- - Atendimentos finalizados (com data de saída)
-- - Atendimentos em curso (sem data de saída)
-- - Diferentes riscos (Verde, Amarelo, Vermelho)
-- - Diferentes profissionais responsáveis

INSERT INTO Atendimento (
    Data_Hora_Entrada, Data_Hora_Saída, CID, Observações, Temperatura, 
    Pressão_Arterial, Nível_de_Risco, Frequência_Cardíaca, CPF_Paciente, 
    CPF_Dentista, CPF_Assistente_Social, CPF_Médico, CPF_Técnico_de_Radiologia, CPF_Profissional_de_Enfermagem
) VALUES
-- Atendimentos Finalizados (Médicos)
('2024-03-01 08:00:00', '2024-03-01 09:30:00', 'J00', 'Resfriado comum', 37, '12/8', 'Verde', 80, '11111111111', NULL, NULL, 'DOC11111111', NULL, 'ENF00000001'),
('2024-03-01 10:00:00', '2024-03-01 11:00:00', 'R51', 'Cefaleia', 36, '13/9', 'Verde', 85, '22222222222', NULL, NULL, 'DOC11111111', NULL, 'ENF00000001'),
('2024-03-02 14:00:00', '2024-03-02 18:00:00', 'I10', 'Pico hipertensivo', 37, '18/10', 'Amarelo', 100, '33333333333', NULL, NULL, 'DOC22222222', NULL, 'ENF00000002'),
('2024-03-03 09:00:00', '2024-03-03 10:00:00', 'S01', 'Corte superficial', 36, '12/8', 'Verde', 78, '44444444444', NULL, NULL, 'DOC33333333', NULL, 'ENF00000003'),

-- CASO INTERESSANTE: Atendimento de Emergência (Risco Vermelho) - Ainda sem saída (Internado?)
('2024-03-04 22:00:00', NULL, 'I21', 'Infarto agudo', 35, '9/6', 'Vermelho', 120, '55555555555', NULL, NULL, 'DOC44444444', NULL, 'ENF00000004'),

-- Atendimentos Odontológicos
('2024-03-05 08:00:00', '2024-03-05 09:00:00', 'K02', 'Cárie', 36, '12/8', 'Verde', 70, '66666666666', 'DEN00000001', NULL, NULL, NULL, NULL),
('2024-03-05 09:30:00', '2024-03-05 10:30:00', 'K04', 'Canal', 36, '12/8', 'Verde', 72, '77777777777', 'DEN00000001', NULL, NULL, NULL, NULL),

-- Atendimento Social
('2024-03-06 10:00:00', '2024-03-06 11:00:00', 'Z59', 'Problemas de habitação', 36, '12/8', 'Azul', 70, '88888888888', NULL, 'ASS00000001', NULL, NULL, NULL),

-- Mais atendimentos gerais
('2024-03-07 11:00:00', '2024-03-07 12:00:00', 'A09', 'Diarreia', 38, '11/7', 'Verde', 90, '99999999999', NULL, NULL, 'DOC55555555', NULL, 'ENF00000005'),
('2024-03-07 13:00:00', '2024-03-07 13:30:00', 'B34', 'Virose', 37, '12/8', 'Verde', 82, '00000000000', NULL, NULL, 'DOC55555555', NULL, 'ENF00000005'),
('2024-03-08 08:00:00', '2024-03-08 10:00:00', 'S82', 'Fratura de perna', 37, '13/8', 'Amarelo', 95, '10101010101', NULL, NULL, 'DOC66666666', 'RAD00000001', 'ENF00000006'), -- Com Raio-X

-- CASO INTERESSANTE: Atendimento longo (observação)
('2024-03-09 08:00:00', '2024-03-10 08:00:00', 'J18', 'Pneumonia', 39, '11/7', 'Amarelo', 105, '12121212121', NULL, NULL, 'DOC77777777', 'RAD00000002', 'ENF00000007'),

-- Completando até 25+
('2024-03-11 10:00:00', '2024-03-11 10:30:00', 'Z00', 'Checkup', 36, '12/8', 'Azul', 70, '13131313131', NULL, NULL, 'DOC88888888', NULL, 'ENF00000008'),
('2024-03-11 11:00:00', '2024-03-11 11:45:00', 'R10', 'Dor abdominal', 37, '12/8', 'Verde', 88, '14141414141', NULL, NULL, 'DOC99999999', NULL, 'ENF00000009'),
('2024-03-11 14:00:00', '2024-03-11 15:00:00', 'H10', 'Conjuntivite', 36, '12/8', 'Verde', 75, '15151515151', NULL, NULL, 'DOC11111111', NULL, 'ENF00000010'),
('2024-03-12 09:00:00', '2024-03-12 10:00:00', 'M54', 'Dor nas costas', 36, '13/8', 'Verde', 80, '16161616161', NULL, NULL, 'DOC22222222', NULL, 'ENF00000011'),
('2024-03-12 15:00:00', NULL, 'S92', 'Fratura pé', 37, '14/9', 'Amarelo', 92, '17171717171', NULL, NULL, 'DOC33333333', 'RAD00000003', 'ENF00000012'), -- Em aberto
('2024-03-13 08:00:00', '2024-03-13 09:00:00', 'J03', 'Amigdalite', 39, '11/7', 'Amarelo', 100, '18181818181', NULL, NULL, 'DOC44444444', NULL, 'ENF00000013'),
('2024-03-13 10:00:00', '2024-03-13 10:15:00', 'W54', 'Mordida de cão', 37, '12/8', 'Verde', 85, '19191919191', NULL, NULL, 'DOC55555555', NULL, 'ENF00000014'),
('2024-03-14 20:00:00', '2024-03-14 22:00:00', 'R07', 'Dor no peito', 37, '15/10', 'Vermelho', 110, '20202020202', NULL, NULL, 'DOC66666666', NULL, 'ENF00000015'),
('2024-03-15 08:00:00', '2024-03-15 09:00:00', 'L03', 'Celulite infecciosa', 38, '12/8', 'Amarelo', 90, '21212121212', NULL, NULL, 'DOC77777777', NULL, 'ENF00000016'),
('2024-03-15 10:00:00', '2024-03-15 11:00:00', 'N39', 'Infecção urinária', 38, '12/8', 'Amarelo', 95, '23232323232', NULL, NULL, 'DOC88888888', NULL, 'ENF00000017'),
('2024-03-16 14:00:00', '2024-03-16 16:00:00', 'G43', 'Enxaqueca forte', 36, '13/8', 'Verde', 80, '24242424242', NULL, NULL, 'DOC99999999', NULL, 'ENF00000018'),
('2024-03-17 11:00:00', NULL, 'A90', 'Dengue', 39, '10/6', 'Amarelo', 110, '25252525252', NULL, NULL, 'DOC11111111', NULL, 'ENF00000019'), -- Em aberto
('2024-03-18 09:00:00', '2024-03-18 10:00:00', 'B01', 'Catapora', 38, '11/7', 'Verde', 90, '26262626262', NULL, NULL, 'DOC22222222', NULL, 'ENF00000020');

-- ============================================================
-- 5. DETALHES E ASSOCIAÇÕES
-- ============================================================

-- Paciente_Ocupa_Leito
-- CASO INTERESSANTE: Leitos que ainda estão ocupados (Data_Alta é NULL)
INSERT INTO Paciete_Ocupa_Leito (Data_de_Entrada, Data_de_Alta, CPF_Paciente, ID_Leito) VALUES
('2024-03-04', NULL, '55555555555', 3), -- O paciente do infarto (Emergência)
('2024-03-09', '2024-03-10', '12121212121', 1), -- O da pneumonia (já saiu)
('2024-03-12', NULL, '17171717171', 5), -- Fratura pé (ainda lá)
('2024-03-17', NULL, '25252525252', 2), -- Dengue (ainda lá)
-- Histórico antigo (quartos já liberados)
('2024-02-01', '2024-02-05', '11111111111', 1),
('2024-02-10', '2024-02-12', '22222222222', 4),
('2024-02-15', '2024-02-20', '33333333333', 6),
('2024-02-20', '2024-02-21', '44444444444', 7),
('2024-01-05', '2024-01-15', '55555555555', 3),
('2024-01-20', '2024-01-25', '66666666666', 8),
('2024-02-28', '2024-03-01', '77777777777', 9),
('2024-02-02', '2024-02-03', '88888888888', 10),
('2024-02-04', '2024-02-08', '99999999999', 11),
('2024-02-09', '2024-02-11', '00000000000', 12),
('2024-02-12', '2024-02-13', '10101010101', 13),
('2024-02-14', '2024-02-18', '12121212121', 14),
('2024-02-20', '2024-02-25', '13131313131', 15),
('2024-02-22', '2024-02-23', '14141414141', 16),
('2024-02-25', '2024-02-28', '15151515151', 17),
('2024-02-26', '2024-02-27', '16161616161', 18),
('2024-01-01', '2024-01-10', '18181818181', 19),
('2024-01-12', '2024-01-14', '19191919191', 20),
('2024-01-15', '2024-01-20', '20202020202', 21),
('2024-01-22', '2024-01-23', '21212121212', 22),
('2024-01-25', '2024-01-30', '23232323232', 23);

-- Amostra Coletada
-- CASO INTERESSANTE: Exames atrasados (Data no passado e ainda sem liberação conceitualmente, mas aqui marcamos a previsão)
INSERT INTO Amostra_Coletada (Tipo, Exame, Previsão_Liberação, ID_Atendimento) VALUES
('Sangue', 'Hemograma', '2024-03-01 12:00:00', 1),
('Urina', 'Urocultura', '2024-03-01 15:00:00', 2),
('Sangue', 'Colesterol', '2024-03-02 16:00:00', 3),
('Sangue', 'Troponina', '2024-03-04 23:00:00', 5), -- Urgente
('Sangue', 'Glicemia', '2024-03-07 14:00:00', 8),
('Fezes', 'Parasitológico', '2024-03-07 15:00:00', 9),
('Sangue', 'Hemograma', '2024-03-09 10:00:00', 12),
-- Exame muito atrasado (Era pra sair em 2023, backend deve alertar)
('Sangue', 'Hormônios', '2023-12-01 10:00:00', 13), 
('Urina', 'EAS', '2024-03-11 12:00:00', 14),
('Secreção', 'Cultura Ocular', '2024-03-11 16:00:00', 15),
('Sangue', 'PCR', '2024-03-13 10:00:00', 18),
('Sangue', 'Plaquetas', '2024-03-17 12:00:00', 24),
-- Mais exames
('Sangue', 'Tireoide', '2024-03-18 10:00:00', 25),
('Sangue', 'Vitamina D', '2024-03-18 10:00:00', 1),
('Sangue', 'Ferro', '2024-03-18 10:00:00', 2),
('Sangue', 'Magnésio', '2024-03-18 10:00:00', 3),
('Urina', '24 horas', '2024-03-18 10:00:00', 5),
('Sangue', 'Sódio', '2024-03-18 10:00:00', 8),
('Sangue', 'Potássio', '2024-03-18 10:00:00', 9),
('Sangue', 'Cálcio', '2024-03-18 10:00:00', 12),
('Biopsia', 'Pele', '2024-03-20 10:00:00', 21), -- Demorado
('Liquor', 'Meningite', '2024-03-04 23:30:00', 5),
('Sangue', 'Lactato', '2024-03-04 23:30:00', 5),
('Swab', 'COVID', '2024-03-09 09:00:00', 12),
('Swab', 'Influenza', '2024-03-09 09:00:00', 12);

-- Transferência
INSERT INTO Transferência (Data_Transferência, Justificativa, Status_Tranferência, Transporte, ID_Atendimento, ID_Hospital) VALUES
('2024-03-04', 'UTI Cardiológica Lotada', 'Concluída', 'Ambulância UTI', 5, 15), -- Transferido pro Hospital do Coração
('2024-03-12', 'Necessidade Cirúrgica', 'Pendente', 'Ambulância', 17, 2), -- Pendente!
('2024-03-17', 'Falta de leito', 'Cancelada', 'Carro Próprio', 24, 5),
-- Histórico
('2024-01-10', 'Especialista', 'Concluída', 'Ambulância', 1, 1),
('2024-01-15', 'UTI Neonatal', 'Concluída', 'Helicóptero', 2, 7),
('2024-02-01', 'Queimaduras', 'Concluída', 'Ambulância', 3, 23),
('2024-02-20', 'Psiquiatria', 'Concluída', 'Ambulância', 4, 1),
('2024-02-25', 'Oncologia', 'Em Andamento', 'Ambulância', 8, 9), -- Em andamento
('2024-02-28', 'Reabilitação', 'Concluída', 'Van', 9, 24),
('2024-03-01', 'Exame Específico', 'Negada', 'N/A', 10, 10), -- Negada
('2024-01-05', 'Isolamento', 'Concluída', 'Ambulância', 11, 3),
('2024-01-20', 'Hemodiálise', 'Concluída', 'Ambulância', 12, 16),
('2024-02-10', 'Neurocirurgia', 'Concluída', 'Helicóptero', 13, 2),
('2024-02-15', 'Transplante', 'Pendente', 'Ambulância UTI', 14, 10),
('2024-02-18', 'Pó-operatório', 'Concluída', 'Ambulância', 15, 4),
('2024-02-22', 'Maternidade', 'Concluída', 'Carro Próprio', 16, 7),
('2024-02-25', 'Pediatria', 'Concluída', 'Ambulância', 18, 14),
('2024-03-02', 'Oftalmologia', 'Concluída', 'Carro Próprio', 19, 20),
('2024-03-05', 'Ortopedia', 'Concluída', 'Ambulância', 20, 2),
('2024-03-08', 'Isolamento', 'Concluída', 'Ambulância', 21, 3),
('2024-03-10', 'UTI', 'Pendente', 'Ambulância UTI', 22, 1),
('2024-03-12', 'Exame', 'Concluída', 'Ambulância', 23, 5),
('2024-03-15', 'Retorno', 'Concluída', 'Ambulância', 25, 6),
('2024-03-16', 'Alta a pedido', 'Cancelada', 'N/A', 1, 1),
('2024-03-18', 'Social', 'Concluída', 'Van', 6, 25);

-- Atendimento_Usa_Equipamento
INSERT INTO Atendimento_Usa_Equipamento (ID_Atendimento, ID_Equipamento) VALUES
(11, 1), -- Raio-X da fratura
(12, 2), -- Raio-X Móvel na pneumonia
(17, 1), -- Raio-X do pé
(5, 3), -- Tomografia no infarto
(1, 1), (2, 1), (3, 2), (4, 2), (6, 3), (7, 3),
(8, 4), (9, 4), (10, 5), (13, 5), (14, 6), (15, 6),
(16, 7), (18, 7), (19, 8), (20, 8), (21, 9), (22, 9),
(23, 10), (24, 10), (25, 11);

-- Atendimento_Usa_Medicamento
INSERT INTO Atendimento_Usa_Medicamento (ID_Atendimento, Nome_Medicamento) VALUES
(1, 'Dipirona'), (2, 'Dipirona'), (2, 'Dramin'), (2, 'Plasil'),
(3, 'Losartana'), (3, 'Furosemida'), -- Pressão alta
(4, 'Dipirona'),
(5, 'AAS'), (5, 'Morfina'), (5, 'Atropina'), -- Infarto
(6, 'Dipirona'),
(7, 'Amoxicilina'),
(8, 'Ibuprofeno'),
(9, 'Amoxicilina'), (9, 'Dipirona'),
(11, 'Tramadol'), -- Dor forte na fratura
(12, 'Azitromicina'), -- Pneumonia
(14, 'Buscopan'),
(15, 'Colírio'), -- Ops, nao tem colirio, ignorar
(17, 'Tramadol'),
(18, 'Amoxicilina'),
(19, 'Amoxicilina'),
(20, 'AAS'),
(21, 'Ceftriaxona'), -- Celulite
(22, 'Ceftriaxona'), -- Infecção urinária
(23, 'Dipirona'), (23, 'Plasil'),
(24, 'Paracetamol'),
(25, 'Paracetamol');
