# Test script for backend endpoints (improved)
# Usage: open PowerShell, activate your venv, start the API, then run this script:
#   .\.venv\Scripts\Activate.ps1
#   python backend\main.py    # in another shell
#   .\backend\scripts\test_endpoints.ps1

$BaseUrl = 'http://127.0.0.1:8000'

function Do-Get($path) {
	$uri = "$BaseUrl$path"
	Write-Host "GET $uri"
	try {
		$resp = Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop
		$resp | ConvertTo-Json -Depth 5
	} catch {
		Write-Host "ERROR: $_"
	}
	Write-Host "`n";
}

function Do-Post($path, $bodyObj) {
	$uri = "$BaseUrl$path"
	Write-Host "POST $uri"
	$json = $bodyObj | ConvertTo-Json -Depth 6
	try {
		$resp = Invoke-RestMethod -Uri $uri -Method Post -Body $json -ContentType 'application/json' -ErrorAction Stop
		$resp | ConvertTo-Json -Depth 5
	} catch {
		Write-Host "ERROR: $_"
	}
	Write-Host "`n";
}

function Do-Put($path, $bodyObj) {
	$uri = "$BaseUrl$path"
	Write-Host "PUT $uri"
	$json = $bodyObj | ConvertTo-Json -Depth 6
	try {
		$resp = Invoke-RestMethod -Uri $uri -Method Put -Body $json -ContentType 'application/json' -ErrorAction Stop
		$resp | ConvertTo-Json -Depth 5
	} catch {
		Write-Host "ERROR: $_"
	}
	Write-Host "`n";
}

# Helper: get JSON (parsed) or $null
function Get-Json($path) {
	$uri = "$BaseUrl$path"
	try {
		return Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop
	} catch {
		Write-Host "WARN: GET $uri failed: $_"
		return $null
	}
}

# Helper: find a property value by pattern (case-insensitive) in an object
function Get-PropValueMatching($obj, $pattern) {
	if (-not $obj) { return $null }
	foreach ($p in $obj.PSObject.Properties) {
		if ($p.Name -match $pattern) { return $p.Value }
	}
	return $null
}

# Discover existing resources to use in POSTs (avoid hardcoded CPFs/IDs)
Write-Host "Discovering existing resources to use in tests..."
$pacientes = Get-Json "/pacientes"
$paciente0 = $null
if ($pacientes -and $pacientes.Count -gt 0) { $paciente0 = $pacientes[0] }
$cpf_paciente = Get-PropValueMatching $paciente0 'cpf'

$medicos = Get-Json "/medicos"
$medico0 = $null
if ($medicos -and $medicos.Count -gt 0) { $medico0 = $medicos[0] }
$cpf_medico = Get-PropValueMatching $medico0 'cpf'

$dentistas = Get-Json "/dentistas"
$dentista0 = $null
if ($dentistas -and $dentistas.Count -gt 0) { $dentista0 = $dentistas[0] }
$cpf_dentista = Get-PropValueMatching $dentista0 'cpf'

$consultorios = Get-Json "/consultorios"
$consultorio_id = $null
if ($consultorios -and $consultorios.Count -gt 0) { $consultorio_id = Get-PropValueMatching $consultorios[0] 'id' }

$leitos = Get-Json "/leitos"
$leito_id = $null
if ($leitos -and $leitos.Count -gt 0) { $leito_id = Get-PropValueMatching $leitos[0] 'id' }

$turnos = Get-Json "/turnos"
$turno_id = $null
if ($turnos -and $turnos.Count -gt 0) { $turno_id = Get-PropValueMatching $turnos[0] 'id' }

$equipamentos = Get-Json "/equipamentos"
$equipamento_id = $null
if ($equipamentos -and $equipamentos.Count -gt 0) { $equipamento_id = Get-PropValueMatching $equipamentos[0] 'id' }

Write-Host "Discovered: cpf_paciente=$cpf_paciente, cpf_medico=$cpf_medico, cpf_dentista=$cpf_dentista, consultorio_id=$consultorio_id, leito_id=$leito_id, turno_id=$turno_id, equipamento_id=$equipamento_id"

Write-Host "`nProceeding with tests using discovered resources (fallbacks will be used when necessary).";

# === Basic GETs ===
Do-Get "/turnos/escala/colaborador?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))"
Do-Get "/turnos/escala/data?data=2025-11-10"
Do-Get "/turnos/escala/intervalo?data_inicio=2025-11-10&data_fim=2025-11-14"
if ($turno_id) { Do-Get "/turnos/$($turno_id)/colaboradores" }

Do-Get "/leitos/disponiveis?tipo=Comum"

# sala/consultorio availability
Do-Get "/consultorios/livres?timestamp=2025-11-10%2009:00:00"
Do-Get "/salas/desocupadas?timestamp=2025-11-10%2009:00:00"
Do-Get "/salas-raio-x/desocupadas?timestamp=2025-11-10%2009:00:00"

# atendimento queries
if ($cpf_paciente) { Do-Get "/atendimentos?cpf_paciente=$([System.Uri]::EscapeDataString($cpf_paciente))" }
Do-Get "/atendimentos/risco?nivel_risco=Alto&data=2025-11-10"
Do-Get "/atendimentos/risco/contagem?nivel_risco=Alto&data=2025-11-10"
if ($cpf_medico) { Do-Get "/atendimentos/profissional?cpf=$([System.Uri]::EscapeDataString($cpf_medico))" }
if ($cpf_paciente) { Do-Get "/atendimentos/exames-paciente?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))&data=2025-11-10" }
if ($cpf_paciente) { Do-Get "/atendimentos/exames?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))" }
if ($cpf_paciente) { Do-Get "/atendimentos/resultados?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))&status=Dispon%C3%ADvel" }
if ($cpf_paciente) { Do-Get "/atendimentos/exames/historico?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))&data_inicio=2025-11-01&data_fim=2025-11-15" }

# transferencias
if ($cpf_paciente) { Do-Get "/transferencias/paciente?cpf=$([System.Uri]::EscapeDataString($cpf_paciente))" }

# === Example POSTs ===
# Create an atendimento using discovered paciente/medico if available
$novoAtendimento = @{
	data_hora_entrada = '2025-11-20 10:00:00'
	cid = 'A00'
	observacoes = 'Teste via script'
	temperatura = 36
	pressao_arterial = '120/80'
	nivel_risco = 'Baixo'
	frequencia_cardiaca = 80
	cpf_paciente = $cpf_paciente
	cpf_medico = $cpf_medico
}
Do-Post "/atendimentos" $novoAtendimento

# Add amostra to atendimento id 1 if it exists, otherwise skip
$amostra = @{ tipo = 'Sangue'; exame = 'Hemograma'; previsao_liberacao = '2025-11-21 10:00:00' }
Do-Post "/atendimentos/1/amostras" $amostra

# Register consultorio usage using discovered IDs/CPFs
$usoConsultorio = @{
	id_consultorio = $consultorio_id
	id_turno = $turno_id
	cpf_medico = $cpf_medico
	cpf_dentista = $cpf_dentista
}
Do-Post "/consultorios/uso" $usoConsultorio

# Register ocupacao using discovered paciente/leito
$ocupacao = @{ cpf_paciente = $cpf_paciente; id_leito = $leito_id; data_entrada = '2025-11-20 09:00:00' }
Do-Post "/leitos/ocupacoes" $ocupacao

# === Example PUTs ===
# Finalizar atendimento
$finalizar = @{ data_hora_saida = '2025-11-20 12:00:00' }
Do-Put "/atendimentos/1/finalizar" $finalizar

# Finalizar ocupacao
$finalizarOcup = @{ cpf_paciente = $cpf_paciente; id_leito = $leito_id; data_alta = '2025-11-20 12:00:00' }
Do-Put "/leitos/ocupacoes/finalizar" $finalizarOcup

Write-Host "Script execution finished. Ajuste IDs e CPFs conforme seu banco de testes."
