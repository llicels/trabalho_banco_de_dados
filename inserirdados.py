import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000"

# Listas de dados realistas
nomes = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Helena", 
         "Igor", "Julia", "Kleber", "Larissa", "Marcos", "Natália", "Otávio", "Patrícia",
         "Rafael", "Sandra", "Thiago", "Ursula", "Vitor", "Wanessa", "Xavier", "Yara", "Zeca"]

sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
              "Pereira", "Lima", "Gomes", "Ribeiro", "Carvalho", "Almeida", "Costa", "Martins"]

# CIDs médicos realistas
cids_medicos = [
    "A09",   # Diarreia e gastroenterite de origem infecciosa presumível
    "A15.0", # Tuberculose pulmonar
    "B34.9", # Infecção viral não especificada
    "C50.9", # Neoplasia maligna da mama, não especificada
    "D50.9", # Anemia por deficiência de ferro, não especificada
    "E11.9", # Diabetes mellitus tipo 2 sem complicações
    "F32.9", # Episódio depressivo, não especificado
    "G43.9", # Enxaqueca, não especificada
    "H10.9", # Conjuntivite não especificada
    "I10",   # Hipertensão essencial (primária)
    "I20.9", # Angina pectoris, não especificada
    "I50.9", # Insuficiência cardíaca, não especificada
    "J00",   # Nasofaringite aguda (resfriado comum)
    "J18.9", # Pneumonia, não especificada
    "K25.9", # Úlcera gástrica, não especificada
    "K59.0", # Constipação
    "M79.1", # Mialgia
    "N18.9", # Doença renal crônica, não especificada
    "O80",   # Parto único espontâneo
    "R50.9", # Febre, não especificada
    "S72.0", # Fratura do colo do fêmur
    "T14.9", # Lesão não especificada
    "U07.1", # COVID-19, identificado por teste de laboratório
    "Z00.0"  # Exame geral e investigação de pessoas sem queixa
]


# CIDs odontológicos realistas
cids_odontologicos = [
    "K00.0", # Anomalias do desenvolvimento dos dentes
    "K01.1", # Dentes inclusos
    "K02.9", # Cárie dentária não especificada
    "K03.6", # Depósitos nos dentes (tártaro)
    "K04.0", # Polpa dentária inflamada (pulpite)
    "K05.1", # Gengivite crônica
    "K05.3", # Periodontite crônica
    "K06.0", # Retração gengival
    "K07.1", # Anomalias de relação maxilomandibular
    "K08.1", # Perda de dentes devido a acidente ou doença periodontal
    "K09.0", # Cisto odontogênico de desenvolvimento
    "K10.2", # Inflamação e infecção dos maxilares
    "K11.2", # Sialadenite (inflamação das glândulas salivares)
    "K12.0", # Estomatite aftosa recorrente
    "K13.2", # Leucoplasia oral não especificada
    "K14.0"  # Glossite (inflamação da língua)
]

# Set para evitar CPFs duplicados (deve ser definido antes das funções)
cpfs_usados = set()

def gerar_cpf():
    """Gera um CPF único"""
    while True:
        cpf = ''.join([str(random.randint(0, 9)) for _ in range(11)])
        if cpf not in cpfs_usados:
            cpfs_usados.add(cpf)
            return cpf

def gerar_rg():
    return ''.join([str(random.randint(0, 9)) for _ in range(9)])

def gerar_telefone():
    return f"({random.randint(10, 99)}) {random.randint(10000, 99999)}-{random.randint(1000, 9999)}"

def gerar_data_nascimento():
    start = datetime(1950, 1, 1)
    end = datetime(2010, 12, 31)
    delta = end - start
    days = random.randint(0, delta.days)
    return (start + timedelta(days=days)).strftime("%Y-%m-%d")

def gerar_data_recente():
    start = datetime(2023, 1, 1)
    end = datetime.now()
    delta = end - start
    days = random.randint(0, delta.days)
    return (start + timedelta(days=days)).strftime("%Y-%m-%d")

def gerar_timestamp_recente():
    start = datetime(2024, 1, 1)
    end = datetime.now()
    delta = end - start
    seconds = random.randint(0, int(delta.total_seconds()))
    return (start + timedelta(seconds=seconds)).strftime("%Y-%m-%d %H:%M:%S")

def gerar_sinais_vitais_coerentes(nivel_risco):
    """Gera sinais vitais coerentes com o nível de risco"""
    if nivel_risco == "Crítico":
        temp = random.randint(38, 42)  # Febre alta
        pressao_sis = random.choice([random.randint(60, 90), random.randint(160, 200)])  # Hipotensão ou hipertensão extrema
        pressao_dia = random.randint(40, 60) if pressao_sis < 100 else random.randint(100, 120)
        freq = random.randint(100, 150)  # Taquicardia
    elif nivel_risco == "Alto":
        temp = random.randint(37, 39)  # Febre moderada
        pressao_sis = random.randint(90, 160)
        pressao_dia = random.randint(50, 100)
        freq = random.randint(80, 120)
    elif nivel_risco == "Médio":
        temp = random.randint(36, 38)  # Normal ou febril leve
        pressao_sis = random.randint(100, 140)
        pressao_dia = random.randint(60, 90)
        freq = random.randint(60, 100)
    else:  # Baixo
        temp = random.randint(36, 37)  # Normal
        pressao_sis = random.randint(110, 130)
        pressao_dia = random.randint(70, 85)
        freq = random.randint(60, 80)
    
    return temp, f"{pressao_sis}/{pressao_dia}", freq

def fazer_post(endpoint, data, mostrar_erro=False):
    try:
        response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        if response.status_code == 200:
            return True
        else:
            if mostrar_erro:
                try:
                    erro_msg = response.json()
                    print(f"  ✗ {endpoint}: {response.status_code} - {erro_msg}")
                except:
                    print(f"  ✗ {endpoint}: {response.status_code} - {response.text[:100]}")
            return False
    except Exception as e:
        if mostrar_erro:
            print(f"  ✗ Erro em {endpoint}: {e}")
        return False

def fazer_get(endpoint, mostrar_erro=False):
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        if response.status_code == 200:
            return response.json()
        else:
            if mostrar_erro:
                try:
                    erro_msg = response.json()
                    print(f"  ✗ GET {endpoint}: {response.status_code} - {erro_msg}")
                except:
                    print(f"  ✗ GET {endpoint}: {response.status_code} - {response.text[:100]}")
    except Exception as e:
        if mostrar_erro:
            print(f"  ✗ Erro em GET {endpoint}: {e}")
    return []

def fazer_put(endpoint, data, mostrar_erro=False):
    try:
        response = requests.put(f"{BASE_URL}{endpoint}", json=data)
        if response.status_code == 200:
            return True
        else:
            if mostrar_erro:
                try:
                    erro_msg = response.json()
                    print(f"  ✗ PUT {endpoint}: {response.status_code} - {erro_msg}")
                except:
                    print(f"  ✗ PUT {endpoint}: {response.status_code} - {response.text[:100]}")
            return False
    except Exception as e:
        if mostrar_erro:
            print(f"  ✗ Erro em PUT {endpoint}: {e}")
        return False

def atualizar_hospitais_cache():
    global hospitais_cache
    hospitais_cache = fazer_get("/hospitais")
    return hospitais_cache

def criar_atendimento_controlado(payload, descricao=""):
    if fazer_post("/atendimentos", payload, mostrar_erro=True):
        registros = fazer_get(f"/atendimentos?cpf_paciente={payload['cpf_paciente']}")
        registros_ordenados = sorted(registros, key=lambda x: x.get("data_hora_entrada", ""), reverse=True)
        for registro in registros_ordenados:
            if registro.get("data_hora_entrada") == payload["data_hora_entrada"]:
                return registro.get("id_atendimento")
        return registros_ordenados[0].get("id_atendimento") if registros_ordenados else None
    return None

# Armazenar IDs gerados
salas_raio_x_ids = []
salas_ids = []
consultorios_ids = []
consultorios_gerais_ids = []
consultorios_odontologicos_ids = []
leitos_ids = []
pacientes_cpfs = []
medicos_cpfs = []
dentistas_cpfs = []
assistentes_sociais_cpfs = []
tecnicos_radiologia_cpfs = []
profissionais_enfermagem_cpfs = []
colaboradores_gerais_cpfs = []
turnos_ids = []
equipamentos_ids = []
medicamentos_nomes = []
atendimentos_ids = []
atendimentos_odontologicos_ids = []
atendimentos_medicos_ids = []
transferencias_ids = []
hospitais_cache = []

print("=" * 60)
print("INSERINDO DADOS REALISTAS PARA UPA")
print("=" * 60)

# 1. Salas de Raio-X (2-3 salas é realista para uma UPA)
print("\n1. Salas de Raio-X (3 salas)...")
for i in range(3):
    response = requests.post(f"{BASE_URL}/salas-raio-x")
    if response.status_code == 200:
        salas_raio_x_ids.append(i + 1)
        print(f"  ✓ Sala {i+1}")

# 2. Salas (proporção realista)
print("\n2. Salas (25 salas)...")
tipos_sala = ["Triagem", "Triagem", "Triagem", "Coleta", "Coleta", "Medicação", "Gesso"]
for i in range(25):
    data = {"tipo": random.choice(tipos_sala)}
    if fazer_post("/salas", data):
        salas_ids.append(i + 1)
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 3. Consultórios (mais gerais que odontológicos)
print("\n3. Consultórios (25 consultórios)...")
tipos_consultorio = ["Geral", "Geral", "Geral", "Odontológico"]  # 75% gerais
for i in range(25):
    data = {"tipo": random.choice(tipos_consultorio)}
    if fazer_post("/consultorios", data):
        consultorios_ids.append(i + 1)
        if data["tipo"] == "Geral":
            consultorios_gerais_ids.append(i + 1)
        else:
            consultorios_odontologicos_ids.append(i + 1)
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 4. Leitos (mais comuns que emergência)
print("\n4. Leitos (25 leitos)...")
tipos_leito = ["Comum", "Comum", "Comum", "Emergência"]  # 75% comuns
for i in range(25):
    data = {"tipo": random.choice(tipos_leito)}
    if fazer_post("/leitos", data):
        leitos_ids.append(i + 1)
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 5. Hospitais base (garantir destinos para transferências)
print("\n5. Hospitais (10 hospitais)...")
nomes_hospitais = [
    "Hospital Central",
    "Hospital Regional Sul",
    "Hospital Municipal Norte",
    "Hospital Universitário",
    "Hospital CardioVida",
    "Hospital Oncológico Esperança",
    "Hospital Ortopédico",
    "Hospital da Criança",
    "Hospital São Lucas",
    "Hospital Santa Maria"
]
for i, nome in enumerate(nomes_hospitais[:10]):
    data = {
        "nome": nome,
        "endereco": f"Avenida {nome} - {i+1}",
        "telefone": gerar_telefone()
    }
    if fazer_post("/hospitais", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/10")

if not atualizar_hospitais_cache():
    print("  ⚠ Não foi possível recuperar os hospitais recém-criados.")

# 5. Pacientes
print("\n5. Pacientes (25 pacientes)...")
enderecos = ["Rua das Flores", "Av. Principal", "Rua Central", "Av. Brasil", "Rua São Paulo"]
for i in range(25):
    nome_completo = f"{random.choice(nomes)} {random.choice(sobrenomes)}"
    data = {
        "rg": gerar_rg(),
        "endereco": random.choice(enderecos),
        "cpf": gerar_cpf(),
        "data_nascimento": gerar_data_nascimento(),
        "nome": nome_completo[:15],
        "telefone": gerar_telefone()
    }
    if fazer_post("/pacientes", data):
        pacientes_cpfs.append(data["cpf"])
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 6. Médicos (menos que enfermeiros)
print("\n6. Médicos (25 médicos)...")

def gerar_crm():
    # CRM é CHAR(10), então máximo 10 caracteres: [UF][NÚMERO]
    # Ex: SP123456 (8 chars) ou SP1234567 (9 chars) ou SP12345678 (10 chars)
    uf = random.choice(["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "DF"])
    # Garantir que total não exceda 10 caracteres
    max_digitos = 10 - len(uf)
    if max_digitos <= 0:
        max_digitos = 1
    numero = random.randint(10**(max_digitos-1), min(10**max_digitos - 1, 99999999))
    crm = f"{uf}{numero}"
    # Garantir que não exceda 10 caracteres
    return crm[:10]

def gerar_rqe():
    # RQE é CHAR(3), então máximo 3 caracteres
    return str(random.randint(100, 999))

for i in range(25):
    nome_completo = f"Dr. {random.choice(nomes)} {random.choice(sobrenomes)}"
    cpf = gerar_cpf()
    data = {
        "nome": nome_completo[:15],
        "cpf": cpf,
        "telefone": gerar_telefone(),
        "crm": gerar_crm(),
        "rqe": gerar_rqe() if random.random() < 0.3 else None
    }
    if fazer_post("/medicos", data, mostrar_erro=(i < 3)):  # Mostrar erros nos primeiros 3
        medicos_cpfs.append(cpf)
        if len(medicos_cpfs) % 5 == 0:
            print(f"  ✓ {len(medicos_cpfs)}/25")

# 7. Dentistas (menos que médicos)
print("\n7. Dentistas (25 dentistas)...")

def gerar_cro():
    # CRO geralmente é [UF][NÚMERO], ex: SP12345
    uf = random.choice(["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "DF"])
    numero = random.randint(1000, 99999)
    return f"{uf}{numero}"

for i in range(25):
    nome_completo = f"Dr(a). {random.choice(nomes)} {random.choice(sobrenomes)}"
    data = {
        "nome": nome_completo[:15],
        "cpf": gerar_cpf(),
        "telefone": gerar_telefone(),
        "cro": gerar_cro()
    }
    if fazer_post("/dentistas", data):
        dentistas_cpfs.append(data["cpf"])
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 8. Assistentes Sociais (poucos)
print("\n8. Assistentes Sociais (25 assistentes)...")

def gerar_cress():
    # CRESS é VARCHAR(6), então máximo 6 caracteres
    # Pode ser apenas números ou formato curto
    return str(random.randint(100000, 999999))[:6]

for i in range(25):
    nome_completo = f"{random.choice(nomes)} {random.choice(sobrenomes)}"
    cpf = gerar_cpf()
    data = {
        "nome": nome_completo[:15],
        "cpf": cpf,
        "telefone": gerar_telefone(),
        "cress": gerar_cress()
    }
    if fazer_post("/assistentes-sociais", data, mostrar_erro=(i < 3)):  # Mostrar erros nos primeiros 3
        assistentes_sociais_cpfs.append(cpf)
        if len(assistentes_sociais_cpfs) % 5 == 0:
            print(f"  ✓ {len(assistentes_sociais_cpfs)}/25")

# 9. Técnicos de Radiologia (poucos, ligados a salas de raio-X)
print("\n9. Técnicos de Radiologia (25 técnicos)...")

def gerar_crtr():
    # CRTR é CHAR(7), então máximo 7 caracteres
    # Formato: apenas números de 7 dígitos
    return str(random.randint(1000000, 9999999))[:7]

for i in range(25):
    nome_completo = f"{random.choice(nomes)} {random.choice(sobrenomes)}"
    cpf = gerar_cpf()
    data = {
        "nome": nome_completo[:15],
        "cpf": cpf,
        "telefone": gerar_telefone(),
        "crtr": gerar_crtr(),
        "id_sala_raio_x": random.choice(salas_raio_x_ids) if salas_raio_x_ids else None
    }
    if fazer_post("/tecnicos-radiologia", data, mostrar_erro=(i < 3)):  # Mostrar erros nos primeiros 3
        tecnicos_radiologia_cpfs.append(cpf)
        if len(tecnicos_radiologia_cpfs) % 5 == 0:
            print(f"  ✓ {len(tecnicos_radiologia_cpfs)}/25")

# 10. Profissionais de Enfermagem (mais técnicos que enfermeiros)
print("\n10. Profissionais de Enfermagem (25 profissionais)...")
categorias = ["T", "T", "T", "E"]  # 75% técnicos

def gerar_coren():
    # COREN geralmente é [UF][NÚMERO], ex: SP123456, RJ654321
    uf = random.choice(["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "DF"])
    numero = random.randint(10000, 999999)
    return f"{uf}{numero}"

for i in range(25):
    nome_completo = f"{random.choice(nomes)} {random.choice(sobrenomes)}"
    # Enfermeiros mais em salas de triagem/medicação
    id_sala = None
    if random.random() < 0.4:
        id_sala = random.choice(salas_ids) if salas_ids else None
    
    data = {
        "nome": nome_completo[:15],
        "cpf": gerar_cpf(),
        "telefone": gerar_telefone(),
        "coren": gerar_coren(),
        "categoria": random.choice(categorias),
        "id_sala": id_sala
    }
    if fazer_post("/profissionais-enfermagem", data):
        profissionais_enfermagem_cpfs.append(data["cpf"])
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 11. Colaboradores Gerais
print("\n11. Colaboradores Gerais (25 colaboradores)...")
funcoes = ["Recepcionista", "Auxiliar", "Segurança", "Limpeza", "Porteiro"]
for i in range(25):
    nome_completo = f"{random.choice(nomes)} {random.choice(sobrenomes)}"
    data = {
        "nome": nome_completo[:15],
        "cpf": gerar_cpf(),
        "telefone": gerar_telefone(),
        "funcao": random.choice(funcoes)
    }
    if fazer_post("/colaboradores-gerais", data):
        colaboradores_gerais_cpfs.append(data["cpf"])
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 12. Turnos (horários realistas)
print("\n12. Turnos (25 turnos)...")
dias_semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
turnos_horarios = [
    ("06:00:00", "14:00:00"),  # Manhã
    ("14:00:00", "22:00:00"),  # Tarde
    ("22:00:00", "06:00:00"),  # Noite
]
for i in range(25):
    dia = random.choice(dias_semana)
    hora_chegada, hora_saida = random.choice(turnos_horarios)
    data = {
        "dia_semana": dia,
        "hora_chegada": f"2024-01-01 {hora_chegada}",
        "hora_saida": f"2024-01-02 {hora_saida}" if hora_saida < hora_chegada else f"2024-01-01 {hora_saida}"
    }
    if fazer_post("/turnos", data):
        turnos_ids.append(i + 1)
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 13. Equipamentos de Raio-X
print("\n13. Equipamentos de Raio-X (25 equipamentos)...")
nomes_equipamentos = ["Raio-X Digital", "Raio-X Portátil"]
for i in range(25):
    data = {
        "nome": f"{random.choice(nomes_equipamentos)} {i+1}",
        "ultima_manutencao": gerar_data_recente()
    }
    if fazer_post("/equipamentos", data):
        equipamentos_ids.append(i + 1)
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 14. Medicamentos
print("\n14. Medicamentos (25 medicamentos)...")
nomes_medicamentos = ["Paracetamol", "Ibuprofeno", "Dipirona", "Amoxicilina", "Azitromicina",
                      "Omeprazol", "Losartana", "Metformina", "Atenolol", "Sinvastatina",
                      "Dorflex", "Novalgina", "Tylenol", "Nimesulida", "Cefalexina",
                      "Aspirina", "Diclofenaco", "Captopril", "Furosemida", "Hidroclorotiazida",
                      "Ranitidina", "Metoclopramida", "Bromoprida", "Dimenidrinato", "Loratadina"]
# Usar lista completa para evitar duplicações
medicamentos_inseridos = 0
for nome_med in nomes_medicamentos[:25]:
    data = {"nome": nome_med[:30]}
    if fazer_post("/medicamentos", data):
        medicamentos_nomes.append(nome_med)
        medicamentos_inseridos += 1
        if medicamentos_inseridos % 5 == 0:
            print(f"  ✓ {medicamentos_inseridos}/25")

# 15. Atendimentos (separar médicos e odontológicos)
print("\n15. Atendimentos (25 atendimentos)...")
niveis_risco = ["Baixo", "Médio", "Médio", "Alto", "Crítico"]  # Mais médios
for i in range(25):
    if not pacientes_cpfs:
        break
    
    # 70% atendimentos médicos, 30% odontológicos
    is_odontologico = random.random() < 0.3
    
    nivel_risco = random.choice(niveis_risco)
    temp, pressao, freq = gerar_sinais_vitais_coerentes(nivel_risco)
    
    if is_odontologico:
        # Atendimento odontológico
        data = {
            "data_hora_entrada": gerar_timestamp_recente(),
            "cid": random.choice(cids_odontologicos),
            "observacoes": f"Atendimento odontológico {i+1}",
            "temperatura": temp,
            "pressao_arterial": pressao,
            "nivel_risco": nivel_risco,
            "frequencia_cardiaca": freq,
            "cpf_paciente": random.choice(pacientes_cpfs),
            "cpf_dentista": random.choice(dentistas_cpfs) if dentistas_cpfs else None,
            "cpf_medico": None,
            "cpf_assistente_social": None,
            "cpf_tecnico_radiologia": None,  # Raio-X odontológico raro em UPA
            "cpf_profissional_enfermagem": random.choice(profissionais_enfermagem_cpfs) if profissionais_enfermagem_cpfs else None,
            "data_hora_saida": None
        }
        if fazer_post("/atendimentos", data):
            atendimentos_odontologicos_ids.append(i + 1)
            atendimentos_ids.append(i + 1)
            if len(atendimentos_ids) % 5 == 0:
                print(f"  ✓ {len(atendimentos_ids)}/25")
    else:
        # Atendimento médico
        precisa_raio_x = random.random() < 0.2  # 20% precisam raio-X
        precisa_assistente = random.random() < 0.1  # 10% precisam assistente social
        
        data = {
            "data_hora_entrada": gerar_timestamp_recente(),
            "cid": random.choice(cids_medicos),
            "observacoes": f"Atendimento médico {i+1}",
            "temperatura": temp,
            "pressao_arterial": pressao,
            "nivel_risco": nivel_risco,
            "frequencia_cardiaca": freq,
            "cpf_paciente": random.choice(pacientes_cpfs),
            "cpf_medico": random.choice(medicos_cpfs) if medicos_cpfs else None,
            "cpf_dentista": None,
            "cpf_assistente_social": random.choice(assistentes_sociais_cpfs) if precisa_assistente and assistentes_sociais_cpfs else None,
            "cpf_tecnico_radiologia": random.choice(tecnicos_radiologia_cpfs) if precisa_raio_x and tecnicos_radiologia_cpfs else None,
            "cpf_profissional_enfermagem": random.choice(profissionais_enfermagem_cpfs) if profissionais_enfermagem_cpfs else None,
            "data_hora_saida": None
        }
        if fazer_post("/atendimentos", data):
            atendimentos_medicos_ids.append(i + 1)
            atendimentos_ids.append(i + 1)
            if len(atendimentos_ids) % 5 == 0:
                print(f"  ✓ {len(atendimentos_ids)}/25")

# 16. Transferências (só para casos graves)
print("\n16. Transferências (25 transferências - casos graves)...")
status_transferencia = ["Aguardando", "Em andamento", "Concluída", "Rejeitada"]
transportes = ["Ambulância", "UTI Móvel", "Helicóptero"]
justificativas = ["Necessita cirurgia", "Falta de leito UPA", "Especialidade não disponível"]
# garantir hospitais disponíveis
if not hospitais_cache:
    atualizar_hospitais_cache()
if not hospitais_cache:
    print("  ⚠ Sem hospitais disponíveis; transferências podem ficar sem destino.")

# Transferir atendimentos médicos (priorizar os primeiros)
atendimentos_para_transferir = atendimentos_medicos_ids[:25] if len(atendimentos_medicos_ids) >= 25 else atendimentos_medicos_ids
transferencias_criadas = 0
for i, id_atend in enumerate(atendimentos_para_transferir):
    hospital_escolhido = random.choice(hospitais_cache) if hospitais_cache else {}
    data = {
        "data_transferencia": gerar_data_recente(),
        "justificativa": random.choice(justificativas),
        "status_transferencia": random.choice(status_transferencia),
        "transporte": random.choice(transportes),
        "id_atendimento": id_atend,
        "id_hospital": hospital_escolhido.get("id_hospital") if hospital_escolhido else None
    }
    if fazer_post("/transferencias", data, mostrar_erro=(i < 3)):
        # Assumir IDs sequenciais começando em 1
        transferencias_ids.append(transferencias_criadas + 1)
        transferencias_criadas += 1
        if transferencias_criadas % 5 == 0:
            print(f"  ✓ {transferencias_criadas}/25")

# 18. Ocupações de Leitos (pacientes graves)
print("\n18. Ocupações de Leitos (25 ocupações)...")
# Pacientes com atendimentos graves ocupam leitos
pacientes_graves = pacientes_cpfs[:25] if len(pacientes_cpfs) >= 25 else pacientes_cpfs
for i, cpf in enumerate(pacientes_graves):
    if not leitos_ids:
        break
    data = {
        "cpf_paciente": cpf,
        "id_leito": random.choice(leitos_ids),
        "data_entrada": gerar_data_recente(),
        "data_alta": None
    }
    if fazer_post("/leitos/ocupacoes", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 19. Condições de Pacientes
print("\n19. Condições de Pacientes (25 condições)...")
condicoes = ["Hipertensão", "Diabetes", "Asma", "Cardiopatia", "Obesidade", "Bronquite", "Artrite"]
pacientes_com_condicoes = pacientes_cpfs[:25] if len(pacientes_cpfs) >= 25 else pacientes_cpfs
for i, cpf in enumerate(pacientes_com_condicoes):
    data = {"condicao": random.choice(condicoes)}
    if fazer_post(f"/pacientes/{cpf}/condicoes", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 20. Alergias de Pacientes
print("\n20. Alergias de Pacientes (25 alergias)...")
alergias = ["Penicilina", "Dipirona", "Iodo", "Látex", "Amendoim", "Aspirina", "Sulfa"]
pacientes_com_alergias = pacientes_cpfs[:25] if len(pacientes_cpfs) >= 25 else pacientes_cpfs
for i, cpf in enumerate(pacientes_com_alergias):
    data = {"alergia": random.choice(alergias)}
    if fazer_post(f"/pacientes/{cpf}/alergias", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 21. Amostras Coletadas (depende de Atendimento)
print("\n21. Amostras Coletadas (25 amostras)...")
tipos_amostra = ["Sangue", "Urina", "Secreção", "Tecido"]
exames = ["Hemograma", "Glicemia", "Colesterol", "Biópsia", "Urocultura", "Hemograma Completo"]
atendimentos_com_amostras = atendimentos_medicos_ids[:25] if len(atendimentos_medicos_ids) >= 25 else atendimentos_medicos_ids
for i, id_atendimento in enumerate(atendimentos_com_amostras):
    data = {
        "tipo": random.choice(tipos_amostra),
        "exame": random.choice(exames),
        "previsao_liberacao": gerar_timestamp_recente()
    }
    if fazer_post(f"/atendimentos/{id_atendimento}/amostras", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 22. Atendimento Usa Equipamento (depende de Atendimento e Equipamento)
print("\n22. Atendimento Usa Equipamento (25 usos)...")
atendimentos_com_equipamento = atendimentos_medicos_ids[:25] if len(atendimentos_medicos_ids) >= 25 else atendimentos_medicos_ids
for i, id_atendimento in enumerate(atendimentos_com_equipamento):
    if not equipamentos_ids:
        break
    data = {
        "id_equipamento": random.choice(equipamentos_ids)
    }
    if fazer_post(f"/atendimentos/{id_atendimento}/equipamentos", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 23. Atendimento Usa Medicamento (depende de Atendimento e Medicamento)
print("\n23. Atendimento Usa Medicamento (25 usos)...")
atendimentos_com_medicamento = atendimentos_ids[:25] if len(atendimentos_ids) >= 25 else atendimentos_ids
for i, id_atendimento in enumerate(atendimentos_com_medicamento):
    if not medicamentos_nomes:
        break
    data = {
        "nome_medicamento": random.choice(medicamentos_nomes)
    }
    if fazer_post(f"/atendimentos/{id_atendimento}/medicamentos", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 24. Uso de Consultório (depende de Consultório, Turno e profissionais)
print("\n24. Uso de Consultório (25 usos)...")
for i in range(25):
    if not consultorios_ids or not turnos_ids:
        break
    
    consultorio_id = random.choice(consultorios_ids)
    # Consultórios odontológicos -> dentistas
    # Consultórios gerais -> médicos
    is_odontologico = consultorio_id in consultorios_odontologicos_ids
    
    data = {
        "id_consultorio": consultorio_id,
        "id_turno": random.choice(turnos_ids),
        "cpf_medico": random.choice(medicos_cpfs) if not is_odontologico and medicos_cpfs else None,
        "cpf_dentista": random.choice(dentistas_cpfs) if is_odontologico and dentistas_cpfs else None,
        "cpf_assistente_social": random.choice(assistentes_sociais_cpfs) if not is_odontologico and random.random() < 0.2 and assistentes_sociais_cpfs else None
    }
    if fazer_post("/consultorios/uso", data):
        if (i + 1) % 5 == 0:
            print(f"  ✓ {i+1}/25")

# 25. Turnos de Profissionais (depende de Turno e profissionais)
print("\n25. Profissionais em Turnos (25 associações)...")
for i in range(25):
    if not turnos_ids:
        break
    
    id_turno = random.choice(turnos_ids)
    
    # Adicionar diferentes tipos de profissionais aleatoriamente
    tipo_profissional = random.choice(["medico", "dentista", "enfermagem", "tecnico", "colaborador"])
    
    if tipo_profissional == "medico" and medicos_cpfs:
        data = {"cpf_medico": random.choice(medicos_cpfs)}
        if fazer_post(f"/turnos/{id_turno}/medicos", data):
            if (i + 1) % 5 == 0:
                print(f"  ✓ {i+1}/25")
    elif tipo_profissional == "dentista" and dentistas_cpfs:
        data = {"cpf_dentista": random.choice(dentistas_cpfs)}
        if fazer_post(f"/turnos/{id_turno}/dentistas", data):
            if (i + 1) % 5 == 0:
                print(f"  ✓ {i+1}/25")
    elif tipo_profissional == "enfermagem" and profissionais_enfermagem_cpfs:
        data = {"cpf_profissional": random.choice(profissionais_enfermagem_cpfs)}
        if fazer_post(f"/turnos/{id_turno}/profissionais-enfermagem", data):
            if (i + 1) % 5 == 0:
                print(f"  ✓ {i+1}/25")
    elif tipo_profissional == "tecnico" and tecnicos_radiologia_cpfs:
        data = {"cpf_tecnico": random.choice(tecnicos_radiologia_cpfs)}
        if fazer_post(f"/turnos/{id_turno}/tecnicos-radiologia", data):
            if (i + 1) % 5 == 0:
                print(f"  ✓ {i+1}/25")
    elif tipo_profissional == "colaborador" and colaboradores_gerais_cpfs:
        data = {"cpf_colaborador": random.choice(colaboradores_gerais_cpfs)}
        if fazer_post(f"/turnos/{id_turno}/colaboradores-gerais", data):
            if (i + 1) % 5 == 0:
                print(f"  ✓ {i+1}/25")

# 26. Casos especiais para dashboards e demonstrações
print("\n26. Casos especiais para dashboards...")
hoje = datetime.now()
hoje_str = hoje.strftime("%Y-%m-%d")
dias_semana_labels = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
dia_semana_nome = dias_semana_labels[hoje.weekday()]

# 26.1 Criar turnos específicos para hoje
turnos_dashboard_ids = []
turno_janelas = [
    ("07:00:00", "15:00:00"),
    ("15:00:00", "23:00:00")
]
for inicio, fim in turno_janelas:
    hora_chegada = f"{hoje_str} {inicio}"
    hora_saida = f"{hoje_str} {fim}"
    data = {
        "dia_semana": dia_semana_nome,
        "hora_chegada": hora_chegada,
        "hora_saida": hora_saida
    }
    if fazer_post("/turnos", data):
        novo_id = len(turnos_ids) + 1
        turnos_ids.append(novo_id)
        turnos_dashboard_ids.append(novo_id)

# 26.2 Garantir equipe escalada nesses turnos
if turnos_dashboard_ids:
    turno_ref = turnos_dashboard_ids[0]
    for cpf in medicos_cpfs[:3]:
        fazer_post(f"/turnos/{turno_ref}/medicos", {"cpf_medico": cpf})
    for cpf in profissionais_enfermagem_cpfs[:4]:
        fazer_post(f"/turnos/{turno_ref}/profissionais-enfermagem", {"cpf_profissional": cpf})
    for cpf in colaboradores_gerais_cpfs[:3]:
        fazer_post(f"/turnos/{turno_ref}/colaboradores-gerais", {"cpf_colaborador": cpf})

# 26.3 Criar atendimentos conflitantes para agenda
def criar_atendimento_para_agenda(cpf_paciente, cpf_medico, data_hora, obs):
    nivel = random.choice(["Médio", "Alto"])
    temp, pressao, freq = gerar_sinais_vitais_coerentes(nivel)
    payload = {
        "data_hora_entrada": data_hora,
        "cid": random.choice(cids_medicos),
        "observacoes": obs,
        "temperatura": temp,
        "pressao_arterial": pressao,
        "nivel_risco": nivel,
        "frequencia_cardiaca": freq,
        "cpf_paciente": cpf_paciente,
        "cpf_medico": cpf_medico,
        "cpf_dentista": None,
        "cpf_assistente_social": None,
        "cpf_tecnico_radiologia": None,
        "cpf_profissional_enfermagem": random.choice(profissionais_enfermagem_cpfs) if profissionais_enfermagem_cpfs else None,
        "data_hora_saida": None
    }
    return criar_atendimento_controlado(payload, obs)

atendimentos_especiais = []
if medicos_cpfs and len(pacientes_cpfs) >= 2:
    medico_foco = medicos_cpfs[0]
    horario_conf_base = hoje.replace(hour=10, minute=0, second=0, microsecond=0)
    pac1, pac2 = pacientes_cpfs[0], pacientes_cpfs[1]
    id_conf1 = criar_atendimento_para_agenda(pac1, medico_foco, horario_conf_base.strftime("%Y-%m-%d %H:%M:%S"), "Atendimento conflito 1")
    id_conf2 = criar_atendimento_para_agenda(pac2, medico_foco, (horario_conf_base + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"), "Atendimento conflito 2")
    if id_conf1:
        atendimentos_especiais.append(id_conf1)
    if id_conf2:
        atendimentos_especiais.append(id_conf2)
    # Finalizar o segundo para gerar exame "Pronto"
    if id_conf2:
        fazer_put(f"/atendimentos/{id_conf2}/finalizar", {"data_hora_saida": (horario_conf_base + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")})

# 26.4 Criar amostras com diferentes status para exames
if atendimentos_especiais:
    agora = datetime.now()
    for idx, id_atendimento in enumerate(atendimentos_especiais):
        if idx == 0:
            previsao = (agora + timedelta(hours=6)).strftime("%Y-%m-%d %H:%M:%S")  # pendente
        elif idx == 1:
            previsao = (agora - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")  # já liberado
        else:
            previsao = gerar_timestamp_recente()
        fazer_post(
            f"/atendimentos/{id_atendimento}/amostras",
            {
                "tipo": random.choice(["Sangue", "Urina"]),
                "exame": random.choice(["Hemograma", "Raio-X Tórax", "PCR", "Ultrassom"]),
                "previsao_liberacao": previsao
            }
        )

# 26.5 Transferências com status variados e hospitais definidos
if hospitais_cache and atendimentos_especiais:
    estados_transferencia_interessantes = ["Aguardando", "Em andamento", "Concluída"]
    for idx, status in enumerate(estados_transferencia_interessantes):
        if idx >= len(atendimentos_especiais):
            break
        data = {
            "data_transferencia": hoje_str,
            "justificativa": justificativas[idx % len(justificativas)],
            "status_transferencia": status,
            "transporte": transportes[idx % len(transportes)],
            "id_atendimento": atendimentos_especiais[idx],
            "id_hospital": random.choice(hospitais_cache).get("id_hospital")
        }
        fazer_post("/transferencias", data, mostrar_erro=True)

print("\n" + "=" * 60)
print("INSERÇÕES CONCLUÍDAS!")
print("=" * 60)
print(f"Resumo:")
print(f"  - Pacientes: {len(pacientes_cpfs)}")
print(f"  - Médicos: {len(medicos_cpfs)}")
print(f"  - Dentistas: {len(dentistas_cpfs)}")
print(f"  - Atendimentos: {len(atendimentos_ids)} (Médicos: {len(atendimentos_medicos_ids)}, Odontológicos: {len(atendimentos_odontologicos_ids)})")
print(f"  - Transferências: {len(transferencias_ids)}")
print("=" * 60)