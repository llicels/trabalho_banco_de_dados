# Sistema de Gerenciamento de UPA 🏥

Este projeto consiste em um sistema web para o gerenciamento de uma Unidade de Pronto Atendimento (UPA). O sistema abrange o controle de fluxo de pacientes, desde a triagem até o atendimento médico, exames e gestão de funcionários e escalas.

## 🛠️ Tecnologias Utilizadas

* **Banco de Dados:** PostgreSQL
* **Backend:** Python (Flask)
* **Frontend:** React (Vite + Tailwind)

---

## 📋 Pré-requisitos

Para executar este projeto localmente, certifique-se de ter instalado em sua máquina:

* [PostgreSQL](https://www.postgresql.org/download/)
* [Python 3.8+](https://www.python.org/downloads/)
* [Node.js](https://nodejs.org/) (versão 16 ou superior)
* [Git](https://git-scm.com/)

---

## 🚀 Instruções de Instalação e Execução

Siga os passos abaixo na ordem apresentada para configurar e rodar o sistema.

### Passo 1: Configuração do Banco de Dados 🗄️

1.  Abra o **pgAdmin 4** ou seu terminal do PostgreSQL.
2.  Crie um novo banco de dados (recomendado: `bd_upa`).
3.  Abra a **Query Tool** (Ferramenta de Consulta) neste banco.
4.  Execute o script de criação das tabelas (`script.sql`).
5.  Execute o script de população de dados para ter registros iniciais de teste.

### Passo 2: Configuração do Backend (API) 🐍

O backend é responsável pela lógica e conexão com o banco de dados.

1.  Abra o terminal na **raiz do projeto** (onde está o arquivo `requirements.txt`).
2.  (Opcional) Crie e ative um ambiente virtual:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Instale as dependências do Python:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configuração de Acesso:** Verifique o arquivo de configuração do banco no backend (geralmente `app.py` ou `.env`) e certifique-se de que o **usuário** e **senha** do PostgreSQL correspondem aos da sua máquina local.
5.  Inicie o servidor:
    ```bash
    python main.py
    # Ou: flask run
    ```
    *O servidor geralmente rodará em `http://localhost:5000`.*

### Passo 3: Configuração do Frontend (Interface) 💻

1.  Abra um **novo terminal** (mantenha o do backend rodando).
2.  Navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
5.  O terminal exibirá o link de acesso local (geralmente **http://localhost:5173/**). Acesse este link no seu navegador.

---

## 🧪 Funcionalidades Principais

* **Prontuário Eletrônico:** Consulta de histórico de atendimentos, exames e medicamentos por paciente.
* **Gestão de Transferências:** Visualização e controle de solicitações de transferência hospitalar.
* **Escala de Plantão:** Visualização de turnos e profissionais alocados.
* **Controle de Salas:** Monitoramento da disponibilidade de consultórios e salas de exame.

---
