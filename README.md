# 💊 DoseCerta — Monitor de Medicamentos

**DoseCerta** é uma Prova de Conceito (PoC) desenvolvida para a AEP 2026.2 do curso de Engenharia de Software da UniCesumar.

A aplicação tem como objetivo auxiliar pacientes e cuidadores no gerenciamento de tratamentos medicamentosos, permitindo cadastrar pacientes, organizar medicamentos, acompanhar horários e registrar o histórico de doses tomadas.

O projeto utiliza uma API REST desenvolvida em Java e Spring Boot, com persistência em MongoDB e uma interface web construída com React e TypeScript.

---

## 📑 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Problema e justificativa](#-problema-e-justificativa)
- [Objetivos de Desenvolvimento Sustentável](#-objetivos-de-desenvolvimento-sustentável)
- [Público-alvo](#-público-alvo)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do sistema](#-arquitetura-do-sistema)
- [Banco de dados](#-banco-de-dados-nosql)
- [Funcionalidades da API](#-funcionalidades-da-api)
- [Validações implementadas](#-validações-implementadas)
- [Como executar o projeto](#-como-executar-o-projeto)
- [Testes e qualidade](#-testes-e-qualidade)
- [Estrutura de diretórios](#-estrutura-de-diretórios)
- [Evolução do projeto](#-evolução-do-projeto)
- [Limitações conhecidas](#-limitações-conhecidas)

---

## 📌 Sobre o projeto

O DoseCerta foi idealizado para oferecer uma maneira simples e organizada de acompanhar tratamentos medicamentosos.

A aplicação permite:

- Cadastrar e consultar pacientes.
- Associar medicamentos aos respectivos pacientes.
- Registrar nome, dosagem e horário dos medicamentos.
- Atualizar horários de administração.
- Registrar doses tomadas.
- Consultar o histórico de administração de medicamentos.
- Manter os registros organizados por paciente.

O projeto está estruturado em duas partes principais:

- **Back-end:** responsável pelas regras de negócio, validações, comunicação com o banco de dados e disponibilização dos endpoints REST.
- **Front-end:** interface web para interação e demonstração das funcionalidades da API.

## 🎯 Problema e justificativa

Pacientes em tratamentos contínuos, especialmente idosos e pessoas com doenças crônicas, podem apresentar dificuldades para controlar os horários e a administração de seus medicamentos.

O esquecimento de doses ou a falta de controle sobre os medicamentos já administrados pode ocasionar situações como:

- Esquecimento de horários.
- Administração duplicada de medicamentos.
- Dificuldade para acompanhar tratamentos prolongados.
- Falta de informações sobre doses anteriormente administradas.

O DoseCerta busca contribuir para a organização dessas informações, oferecendo um sistema centralizado para o acompanhamento dos medicamentos e seus respectivos registros.

## 🌍 Objetivos de Desenvolvimento Sustentável

**ODS 3 — Saúde e Bem-Estar**

O projeto está relacionado ao Objetivo de Desenvolvimento Sustentável 3 da Organização das Nações Unidas, que busca assegurar uma vida saudável e promover o bem-estar para todos.

A proposta contribui para esse objetivo ao oferecer uma ferramenta de apoio à organização de tratamentos medicamentosos, auxiliando pacientes e cuidadores no acompanhamento de suas rotinas.

## 👥 Público-alvo

- Pacientes em tratamento medicamentoso contínuo.
- Idosos que necessitam de acompanhamento de medicamentos.
- Pessoas com doenças crônicas.
- Familiares e cuidadores.
- Profissionais de assistência domiciliar.

---

## 🛠️ Tecnologias utilizadas

### Back-end

| Tecnologia | Finalidade |
|---|---|
| Java 17 | Linguagem de programação |
| Spring Boot 3 | Desenvolvimento da API REST |
| Spring Web | Criação dos endpoints HTTP |
| Spring Data MongoDB | Persistência e acesso aos documentos |
| Bean Validation | Validação dos dados recebidos |
| MongoDB 7 | Banco de dados NoSQL |
| Maven | Gerenciamento de dependências e build |
| JUnit 5 | Testes automatizados |
| Mockito | Simulação de dependências nos testes |
| JaCoCo | Análise de cobertura de testes |
| Swagger / OpenAPI | Documentação interativa da API |
| GitHub Actions | Integração contínua (CI) |

### Front-end

| Tecnologia | Finalidade |
|---|---|
| React 19 | Construção da interface |
| TypeScript | Tipagem estática |
| Vite | Ambiente de desenvolvimento e build |

Documentação específica do front-end: [frontend/README.md](frontend/README.md).

---

## 🏗️ Arquitetura do sistema

O back-end utiliza uma arquitetura em camadas, separando responsabilidades para facilitar a manutenção, organização e evolução do código.

```text
Cliente (React / Swagger)
          |
          v
     Controller
          |
          v
       Service
          |
          v
     Repository
          |
          v
       MongoDB
```

### Responsabilidades das camadas

| Camada | Responsabilidade |
|---|---|
| `controller/` | Receber requisições HTTP e retornar respostas da API. |
| `service/` | Executar regras de negócio e validar operações. |
| `repository/` | Realizar operações de persistência no MongoDB. |
| `model/` | Representar os documentos e objetos do domínio. |
| `dto/` | Representar os dados utilizados em operações específicas. |
| `exception/` | Centralizar o tratamento de exceções da aplicação. |

### Tratamento de erros

A aplicação possui um tratamento centralizado de exceções por meio da classe `GlobalExceptionHandler`.

Os principais códigos HTTP utilizados são:

| Código | Significado | Situação |
|---|---|---|
| 200 | OK | Operação realizada com sucesso. |
| 201 | Created | Cadastro realizado. |
| 204 | No Content | Exclusão realizada. |
| 400 | Bad Request | Dados inválidos. |
| 404 | Not Found | Recurso não encontrado. |
| 409 | Conflict | Operação incompatível com o estado atual dos dados. |

As exceções de recursos não encontrados herdam de `RecursoNaoEncontradoException`, permitindo tratamento centralizado.

A tentativa de remover um paciente que ainda possui medicamentos vinculados retorna HTTP 409.

Os erros de validação retornam HTTP 400 com informações sobre o campo e a respectiva mensagem.

---

## 🗄️ Banco de dados NoSQL

O DoseCerta utiliza o MongoDB 7, um banco de dados orientado a documentos.

Diferentemente de bancos relacionais tradicionais, os dados são armazenados em documentos BSON organizados em coleções.

### Coleções utilizadas

| Coleção | Descrição |
|---|---|
| `pacientes` | Armazena os dados dos pacientes cadastrados. |
| `medicamentos` | Armazena os medicamentos associados aos pacientes. |

### Estrutura dos documentos

**Paciente**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador do paciente. |
| `nome` | String | Nome do paciente. |
| `contato` | String | Contato do paciente. |
| `dataNascimento` | Date | Data de nascimento (opcional). |

**Medicamento**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador do medicamento. |
| `pacienteId` | String | Identificador do paciente vinculado. |
| `nomeMedicamento` | String | Nome do medicamento. |
| `dosagem` | String | Dosagem informada. |
| `horario` | String | Horário no formato HH:mm. |
| `tomado` | Boolean | Indicador de dose tomada. |
| `historicoDoses` | Array | Histórico de doses administradas. |

### Relacionamento entre coleções

O relacionamento entre pacientes e medicamentos utiliza referências por identificador.

```text
       PACIENTES
    ┌──────────────┐
    │ _id          │
    │ nome         │
    │ contato      │
    │ dataNascimento
    └──────┬───────┘
           │
           │ 1:N
           │
    ┌──────▼───────┐
    │ MEDICAMENTOS │
    │ _id          │
    │ pacienteId   │
    │ nome         │
    │ dosagem      │
    │ horario      │
    │ tomado       │
    │ historicoDoses
    └──────────────┘
```

A integridade referencial é controlada pela aplicação, por meio da camada de serviço.

Regras implementadas:

- Não é permitido cadastrar medicamentos para pacientes inexistentes.
- Não é permitido remover pacientes que ainda possuem medicamentos vinculados.
- É necessário remover os medicamentos antes de excluir o respectivo paciente.

A escolha por referências, em vez de incorporar todos os medicamentos dentro do documento do paciente, permite consultar e atualizar medicamentos individualmente.

### Histórico de doses

O campo `historicoDoses` armazena uma lista de subdocumentos dentro de cada medicamento.

Cada registro contém a data e a hora em que a dose foi marcada como tomada.

Exemplo:

```json
{
  "historicoDoses": [
    {
      "dataHora": "2026-09-27T13:01:59.659Z"
    },
    {
      "dataHora": "2026-09-28T13:05:10.000Z"
    }
  ]
}
```

Esse formato permite consultar o histórico de administração, em vez de armazenar apenas o estado atual do medicamento.

### Inicialização do banco

O projeto possui um script de inicialização:

`AEP monitor-medicamentos/mongo-init/init.js`

Esse arquivo configura as coleções com validação de schema por meio de `$jsonSchema` e cria um índice para `medicamentos.pacienteId`.

A inicialização ocorre automaticamente na primeira execução do container MongoDB.

Para conferir as coleções:

```bash
docker exec -it mongo-monitor mongosh monitor_medicamentos --eval "db.getCollectionInfos()"
```

**Importante:** se o volume `mongo-data` já existir, o script de inicialização não será executado novamente.

Para recriar o banco de dados do zero:

```bash
docker compose down -v
docker compose up -d
```

Atenção: o comando `down -v` remove os volumes e, consequentemente, os dados armazenados no banco.

---

## 🔌 Funcionalidades da API

A API REST disponibiliza endpoints para gerenciamento de pacientes e medicamentos.

### Documentação Swagger

Com o back-end em execução, acesse:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

O Swagger permite visualizar os endpoints, consultar parâmetros e realizar requisições diretamente pelo navegador.

### Endpoints de pacientes

Recurso: `/pacientes`

| Método | Endpoint | Descrição | Respostas |
|---|---|---|---|
| POST | `/pacientes` | Cadastrar paciente | 201, 400 |
| GET | `/pacientes` | Listar pacientes | 200 |
| GET | `/pacientes/{id}` | Buscar paciente por ID | 200, 404 |
| DELETE | `/pacientes/{id}` | Remover paciente | 204, 404, 409 |

### Endpoints de medicamentos

Recurso: `/medicamentos`

| Método | Endpoint | Descrição | Respostas |
|---|---|---|---|
| POST | `/medicamentos` | Cadastrar medicamento | 201, 400, 404 |
| GET | `/medicamentos` | Listar medicamentos | 200 |
| GET | `/medicamentos/paciente/{pacienteId}` | Listar por paciente | 200 |
| GET | `/medicamentos/{id}` | Buscar por ID | 200, 404 |
| GET | `/medicamentos/{id}/historico` | Consultar histórico de doses | 200, 404 |
| PATCH | `/medicamentos/{id}/horario` | Atualizar horário | 200, 400, 404 |
| PATCH | `/medicamentos/{id}/tomado` | Registrar dose tomada | 200, 404 |
| DELETE | `/medicamentos/{id}` | Remover medicamento | 204, 404 |

---

## ✅ Validações implementadas

O sistema utiliza Bean Validation para garantir maior consistência nos dados recebidos pela API.

### Pacientes

- Nome obrigatório.
- Nome limitado a 120 caracteres.
- Contato obrigatório.
- Contato limitado a 100 caracteres.
- Data de nascimento opcional.
- Data de nascimento não pode ser futura.

### Medicamentos

- Nome obrigatório.
- Nome limitado a 100 caracteres.
- Dosagem obrigatória.
- Dosagem limitada a 50 caracteres.
- Horário obrigatório e validado no formato HH:mm.

As validações são realizadas por meio de anotações como:

- `@NotBlank`: impede campos de texto vazios.
- `@Size`: estabelece limites de caracteres.
- `@PastOrPresent`: impede datas futuras.
- `@Pattern`: valida formatos específicos.

Quando os dados não atendem às regras estabelecidas, a API retorna HTTP 400 com a descrição do problema.

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de iniciar, verifique se os seguintes recursos estão instalados:

| Ferramenta | Versão mínima |
|---|---|
| Java JDK | 17 |
| Maven | 3.8+ |
| Docker | Versão compatível com Docker Compose |
| Node.js | 20+ |
| npm | Compatível com a versão do Node.js |

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd NOME_DO_REPOSITORIO
```

### 2. Iniciar o banco de dados

Entre na pasta do back-end:

```bash
cd "AEP monitor-medicamentos"
```

Inicie o container MongoDB:

```bash
docker compose up -d
```

### 3. Executar o back-end

Ainda na pasta do back-end, execute:

```bash
mvn spring-boot:run
```

A API estará disponível em:

`http://localhost:8080`

Conexão padrão com o MongoDB:

`mongodb://localhost:27017/monitor_medicamentos`

Para utilizar outra instância do MongoDB, configure a variável de ambiente `MONGO_URI`.

### 4. Executar o front-end

Em outro terminal, volte à raiz do repositório e entre na pasta `frontend`:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A interface estará disponível em:

[http://localhost:5173](http://localhost:5173)

O Vite utiliza um proxy para encaminhar as requisições de `/api` ao back-end, evitando a necessidade de habilitar CORS na configuração atual.

---

## 🧪 Testes e qualidade de código

O projeto utiliza JUnit 5 e Mockito para executar testes automatizados nas diferentes camadas da aplicação.

Para executar os testes e verificar a cobertura:

```bash
cd "AEP monitor-medicamentos"
mvn verify
```

### Ferramentas de qualidade

| Ferramenta | Utilização |
|---|---|
| JUnit 5 | Execução dos testes automatizados. |
| Mockito | Simulação de dependências. |
| JaCoCo | Medição da cobertura de código. |
| GitHub Actions | Execução automatizada do processo de integração contínua. |

### Cobertura de testes

O JaCoCo está configurado no `pom.xml`, com um limite mínimo de 70% de cobertura de linhas.

O comando `mvn verify` verifica esse requisito e falha caso a cobertura fique abaixo do limite estabelecido.

O relatório pode ser consultado após a execução:

`AEP monitor-medicamentos/target/site/jacoco/index.html`

O pipeline do GitHub Actions também executa as verificações do back-end e verifica se o front-end compila por meio de `npm run build`.

**Escopo dos testes:** a cobertura do JaCoCo considera a API e suas camadas de aplicação, excluindo a classe principal de inicialização. O front-end ainda não possui testes automatizados.

---

## 📈 Evolução do projeto

O DoseCerta passou por melhorias entre as entregas da AEP.

| Recurso | 1ª entrega | 2ª entrega |
|---|---|---|
| Coleções MongoDB | Uma coleção (`medicamentos`) | Duas coleções (`pacientes` e `medicamentos`) |
| Cadastro de pacientes | Nome armazenado diretamente no medicamento | Entidade própria |
| Relacionamento | Sem referência estruturada | Referência por `pacienteId` |
| Histórico de doses | Apenas flag `tomado` | Flag e histórico com data/hora |
| Interface | Swagger UI | Swagger UI e aplicação React |
| Validações | Validações iniciais | Regras adicionais para os cadastros |
| Testes | Testes iniciais | Testes de model, service e controller |

### Identificação das entregas

| Entrega | Identificação |
|---|---|
| 1ª entrega | Estado do repositório na primeira publicação. |
| 2ª entrega | Tag `v2.0.0`. |

---

## 📁 Estrutura de diretórios

```text
.
├── README.md
├── QUADRO_DE_TAREFAS.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── AEP monitor-medicamentos/
│   ├── pom.xml
│   ├── docker-compose.yml
│   ├── mongo-init/
│   │   └── init.js
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/aep/monitor/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── model/
│       │   │   ├── dto/
│       │   │   └── exception/
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│           └── java/com/aep/monitor/
│
└── frontend/
    ├── package.json
    ├── README.md
    └── src/
```

---

## ⚠️ Limitações conhecidas

Por se tratar de uma Prova de Conceito (PoC), algumas funcionalidades ainda não foram implementadas:

- A flag `tomado` não retorna automaticamente para `false`; o front-end calcula o estado de tomada no dia a partir do histórico de doses.
- Não existe bloqueio para registrar a mesma dose mais de uma vez.
- O sistema ainda não possui autenticação de usuários.
- O back-end não possui configuração própria de CORS; a comunicação atual depende do proxy do Vite.
- O front-end ainda não possui testes automatizados.

Essas limitações representam possíveis oportunidades de evolução em versões futuras.

---

## 🎓 Considerações finais

O DoseCerta demonstra a aplicação prática de conceitos de Engenharia de Software, desenvolvimento de APIs REST, persistência de dados NoSQL, validação de informações, testes automatizados e integração entre back-end e front-end.

A solução foi desenvolvida como parte das atividades acadêmicas da AEP 2026.2, com foco na construção de uma aplicação funcional e na aplicação dos conhecimentos adquiridos durante o curso.

**DoseCerta — Mais organização e controle no acompanhamento de medicamentos.**
