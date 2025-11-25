-- Consultando a escala de turnos por colaborador, por dia ou por semana e informando também os colaboradores disponíveis em determinado turno;

-- Criando views. Uma junta todos os colaboradores em uma tabela só e a outra junta todas as tuplas (turno, colaborador) em uma tabela só

CREATE VIEW V_TODOS_COLABORADORES AS
(SELECT CPF, Nome, 'Médico' AS Funcao FROM Médico)
UNION ALL
(SELECT CPF, Nome, 'Dentista' AS Funcao FROM Dentista)
UNION ALL
(SELECT CPF, Nome, 'Assistente Social' AS Funcao FROM Assistente_Social)
UNION ALL
(SELECT CPF, Nome, 'Técnico(a) Radiologia' AS Funcao FROM Técnico_de_Radiologia)
UNION ALL
(SELECT CPF, Nome,
    CASE
        WHEN Categoria = 'E' THEN 'Enfermeiro(a)'
        ELSE 'Técnico(a) Enfermagem'
    END AS Funcao
FROM Profissional_de_Enfermagem)
UNION ALL
(SELECT CPF, Nome, Função AS Funcao FROM Colaborador_Geral);


CREATE VIEW V_TODOS_TURNOS AS
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
(SELECT ID_Turno, CPF_Colaborador AS CPF FROM Turno_Colaborador_Geral);


    -- Consultar a escala por colaborador

    -- O backend deve substituir ? pelo CPF do colaborador
SELECT
    t.Dia_da_Semana,
    t.Hora_Chegada,
    t.Hora_Saída,
    vc.Nome,
    vc.Funcao
FROM Turno t
JOIN V_TODOS_TURNOS vt ON t.ID_Turno = vt.ID_Turno
JOIN V_TODOS_COLABORADORES vc ON vt.CPF = vc.CPF
WHERE vc.CPF = ?; 



-- Por data

-- O backend deve substituir ? por uma data (ex: '2025-11-12')
SELECT
    t.Dia_da_Semana,
    t.Hora_Chegada,
    t.Hora_Saída,
    vc.Nome AS Nome_Colaborador,
    vc.Funcao
FROM Turno t
JOIN V_TODOS_TURNOS vt ON t.ID_Turno = vt.ID_Turno
JOIN V_TODOS_COLABORADORES vc ON vt.CPF = vc.CPF
WHERE CAST(t.Hora_Chegada AS DATE) = ?
ORDER BY t.Hora_Chegada, vc.Funcao, vc.Nome;




-- Por um intervalo de tempo específico 

-- -- O backend deve substituir ? pela data de INÍCIO (ex: '2025-11-10')
-- e ? pela data de FIM (ex: '2025-11-14')
SELECT
    t.Dia_da_Semana,
    t.Hora_Chegada,
    t.Hora_Saída,
    vc.Nome AS Nome_Colaborador,
    vc.Funcao
FROM Turno t
JOIN V_TODOS_TURNOS vt ON t.ID_Turno = vt.ID_Turno
JOIN V_TODOS_COLABORADORES vc ON vt.CPF = vc.CPF
WHERE CAST(t.Hora_Chegada AS DATE) BETWEEN ? AND ?
ORDER BY
    -- Ordena para agrupar por dia da semana
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


-- Colaboradores disponíveis em determinado turno
SELECT 
    vc.nome, 
    vc.funcao
FROM v_todos_colaboradores AS vc
JOIN v_todos_turnos AS vt ON vt.cpf = vc.cpf
WHERE vt.id_turno = ?;






-- Consultando os registros por data, paciente e profissional de saúde, conciliado os plantões em que estão alocados e possíveis conflitos de horário (acho que isso é tratablho do script de criação ou inserção);


-- atendimento por paciente, a partir do cpf
SELECT *
FROM atendimento
WHERE cpf_paciente = ?;


-- todos os atendimentos com determinado nivel de risco em determinado dia

SELECT *
FROM atendimento
WHERE 
    nível_de_risco = ? 
    AND CAST(data_hora_entrada AS DATE) = ?; 


-- Contagem de todos os pacientes com determinado nivel de risco em determinado dia

SELECT COUNT (*) AS contagem_risco
FROM atendimento
WHERE 
    nível_de_risco = ?
    AND CAST(data_hora_entrada AS DATE) = ?


-- Atendimentos por profissional da saúde

-- O backend deve substituir TODOS os ? pelo MESMO CPF
SELECT
    ID_Atendimento,
    Data_Hora_Entrada,
    Nível_de_Risco,
    CPF_Paciente
FROM Atendimento
WHERE
    CPF_Médico = ?
    OR CPF_Dentista = ?
    OR CPF_Assistente_Social = ?
    OR CPF_Técnico_de_Radiologia = ?
    OR CPF_Profissional_de_Enfermagem = ?;







-- Consultando a disponibilidade das salas em determinados horários, leitos disponíveis por classificação e o histórico de utilização;

-- Leitos disponiveis por classificação 
-- O backend deve substituir ? pelo tipo de leito (ex: 'Comum' ou 'Emergência')
SELECT
    l.ID_Leito,
    l.Tipo
FROM Leito AS l
WHERE
    l.Tipo = ?
    AND NOT EXISTS (
        SELECT 1
        FROM Paciete_Ocupa_Leito AS pol
        WHERE pol.ID_Leito = l.ID_Leito
          AND pol.Data_de_Alta IS NULL -- 'IS NULL' significa que o paciente AINDA está no leito



-- Consultórios sem médicos em determinado horário

-- O backend deve substituir ? por um TIMESTAMP (data e hora)
-- ex: '2025-11-12 10:00:00'
SELECT
    c.ID_Consultório,
    c.Tipo
FROM Consultório AS c
WHERE NOT EXISTS (
    SELECT 1
    FROM Uso_Consultório AS uc
    JOIN Turno AS t ON uc.ID_Turno = t.ID_Turno
    WHERE
        uc.ID_Consultório = c.ID_Consultório 
        AND ? BETWEEN t.Hora_Chegada AND t.Hora_Saída 
);

-- Histórico de utlização de leitos

SELECT 
	id_leito,
	data_de_entrada,
	data_de_alta
FROM paciete_ocupa_leito


-- Salas (sem ser de raio-x) desocupadas (sem nenhum profissional nelas) em determinado horário
-- O backend deve substituir ? por um TIMESTAMP (data e hora)
-- ex: '2025-11-10 09:00:00'
SELECT
    s.ID_Sala,
    s.Tipo
FROM Sala AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM Profissional_de_Enfermagem AS pe
    JOIN V_TODOS_TURNOS AS vt ON pe.CPF = vt.CPF 
    JOIN Turno AS t ON vt.ID_Turno = t.ID_Turno
    WHERE
        pe.ID_Sala = s.ID_Sala 
        AND ? BETWEEN t.Hora_Chegada AND t.Hora_Saída 
);


-- Salas de raio-x sem nenhum profissional em determinado horário

-- O backend deve substituir ? por um TIMESTAMP (data e hora)
-- ex: '2025-11-10 09:00:00'
SELECT
    srx.ID_Sala_Raio_X
FROM Sala_de_Raio_X AS srx
WHERE NOT EXISTS (
    SELECT 1
    FROM Técnico_de_Radiologia AS tr
    JOIN V_TODOS_TURNOS AS vt ON tr.CPF = vt.CPF 
    JOIN Turno AS t ON vt.ID_Turno = t.ID_Turno
    WHERE
        tr.ID_Sala_de_Raio_X = srx.ID_Sala_Raio_X 
        AND ? BETWEEN t.Hora_Chegada AND t.Hora_Saída 
);







-- Consultando o histórico de atendimentos dentro de determinado período, a classificação de risco atual e diagnósticos, prescrições, exames e procedimentos realizados em períodos anteriores;

-- Atendimentos do paciente x realizados dentro de determinado período

SELECT *
FROM atendimento
WHERE CAST(data_hora_entrada AS DATE) BETWEEN ? AND ?
AND cpf_paciente = ?	
    



--  Exames, remedios e CID e raio-x feitos (se tiver) atrelados à ida, na UPA, do paciente X no dia Y
-- O backend deve substituir o primeiro ? pelo CPF do paciente (ex: '11111111111')
-- O backend deve substituir o segundo ? pela DATA da visita (ex: '2025-11-10')
SELECT
    p.Nome AS Nome_Paciente,
    a.ID_Atendimento,
    a.CID,
    a.Observações,
    
    -- Agrupa todos os exames daquele atendimento em uma única string, separados por vírgula
    STRING_AGG(DISTINCT ac.Exame, ', ') AS Exames_Coletados,
    
    -- Agrupa todos os medicamentos daquele atendimento
    STRING_AGG(DISTINCT aum.Nome_Medicamento, ', ') AS Medicamentos_Aplicados,
    
    -- Agrupa todos os equipamentos de raio-x usados
    STRING_AGG(DISTINCT eqx.Nome, ', ') AS Equipamentos_de_Raio_X_Usados

FROM Paciente AS p
-- Começa com JOIN para garantir que só queremos atendimentos do paciente certo
JOIN Atendimento AS a ON p.CPF = a.CPF_Paciente

-- O LEFT JOIN garante que o atendimento apareça mesmo se não houver exames
LEFT JOIN Amostra_Coletada AS ac ON a.ID_Atendimento = ac.ID_Atendimento

-- O LEFT JOIN garante que o atendimento apareça mesmo se não houver medicamentos
LEFT JOIN Atendimento_Usa_Medicamento AS aum ON a.ID_Atendimento = aum.ID_Atendimento

-- O LEFT JOIN garante que o atendimento apareça mesmo se não houver raio-x
LEFT JOIN Atendimento_Usa_Equipamento AS aue ON a.ID_Atendimento = aue.ID_Atendimento
LEFT JOIN Equipamento_Raio_X AS eqx ON aue.ID_Equipamento = eqx.ID_Equipamento

WHERE
    p.CPF = ? 
    AND CAST(a.Data_Hora_Entrada AS DATE) = ?

-- Agrupa tudo em uma linha por atendimento
GROUP BY
    p.Nome,
    a.ID_Atendimento,
    a.CID,
    a.Observações;





-- Consultando os exames solicitados de um determinado paciente e seu respectivo status, resultados disponíveis e o histórico de exames em determinado período de tempo;

-- Exames de um determinado paciente e seu status 
-- O backend deve substituir o primeiro ? pelo CPF do paciente (ex: '11111111111')

SELECT p.nome, am.exame, am.previsão_liberação
FROM paciente AS p 
JOIN atendimento a ON a.cpf_paciente = p.cpf 
JOIN amostra_coletada AS am ON am.id_atendimento = a.id_atendimento
WHERE a.cpf_paciente = ?

-- Resultados disponíveis de um determinado paciente
-- O backend substitui ? pelo CPF do paciente
-- O backend substitui ? pelo status (ex: 'Disponível' ou 'Pendente')
SELECT
    p.Nome AS Nome_Paciente,
    am.Exame,
    am.Previsão_Liberação,
    CASE
        WHEN am.Previsão_Liberação <= NOW() THEN 'Disponível'
        ELSE 'Pendente'
    END AS Status_Resultado
    
FROM Amostra_Coletada AS am
JOIN Atendimento AS a ON am.ID_Atendimento = a.ID_Atendimento
JOIN Paciente AS p ON a.CPF_Paciente = p.CPF
WHERE
    p.CPF = ?
    AND (
        CASE
            WHEN am.Previsão_Liberação <= NOW() THEN 'Disponível'
            ELSE 'Pendente'
        END
    ) = ? -- Filtra pelo status desejado
ORDER BY
    am.Previsão_Liberação;




-- historico de exames de um paciente em determinado periodo de tempo 

SELECT 
    p.nome, 
    am.exame 
FROM paciente AS p 
JOIN atendimento AS a ON p.cpf = a.cpf_paciente
JOIN amostra_coletada AS am ON am.id_atendimento = a.id_atendimento
WHERE 
    p.cpf = ?
    AND CAST(a.data_hora_entrada AS DATE) BETWEEN ? AND ?
ORDER BY 
    a.data_hora_entrada DESC


-- histórico de chapas de raio-x em determinado periodo (tem que atualizar o bd)









-- Consultando pacientes encaminhados, status do procedimento de transferência, destino e justificativa. (seria bom atualizar o bd)
SELECT p.nome,
t.justificativa, t.status_tranferência, h.nome AS destino
FROM paciente AS p JOIN atendimento AS a ON p.cpf = a.cpf_paciente
JOIN transferência AS t ON a.id_atendimento = t.id_atendimento
JOIN hospital AS h ON t.id_transferência = h.id_transferência
WHERE p.cpf = ?
