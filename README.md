# DoseCerta — Monitor de Medicamentos

**DoseCerta** é o nome da marca do aplicativo. PoC da AEP 2026.2 (Engenharia de Software, UniCesumar): API REST em Java/Spring Boot com
MongoDB (NoSQL) para cadastrar pacientes e seus medicamentos e registrar cada dose tomada,
com uma interface web de demonstração em React.

## Problema
Pacientes em tratamento contínuo — especialmente idosos e pessoas com doenças crônicas —
frequentemente esquecem horários de medicação ou perdem o controle sobre quais remédios já
tomaram no dia. Isso pode levar a doses duplicadas, esquecimentos perigosos e piora do quadro
de saúde.

## ODS relacionado
**ODS 3 — Saúde e Bem-Estar**: a solução contribui para garantir vidas saudáveis e promover o
bem-estar, ajudando pacientes e cuidadores a gerenciar tratamentos medicamentosos de forma
organizada.

## Público-alvo
Pacientes em tratamento contínuo e seus cuidadores (familiares ou profissionais de saúde
domiciliar).

## Evolução entre as entregas

| | 1ª entrega | 2ª entrega (atual) |
|---|---|---|
| Coleções MongoDB | 1 (`medicamentos`) | 2 (`pacientes` e `medicamentos`) |
| Paciente | texto solto (`nomePaciente`) | entidade própria, referenciada por `pacienteId` |
| Relacionamento entre coleções | não havia | `medicamentos.pacienteId` → `pacientes._id`, imposto pela aplicação |
| Objeto complexo | documento plano | `historicoDoses`: lista de subdocumentos dentro de cada medicamento |
| Controle de dose | flag `tomado` | flag `tomado` + histórico com data/hora de cada dose |
| Interface | Swagger UI | Swagger UI + front-end web (`frontend/`) |

## Tecnologias
**Back-end** (`AEP monitor-medicamentos/`)
- Java 17 e Spring Boot 3 (`web`, `data-mongodb`, `validation`)
- MongoDB 7 (NoSQL) em container Docker
- springdoc-openapi (Swagger UI gerado a partir dos controllers)
- Maven, JUnit 5, Mockito
- JaCoCo (cobertura, com verificação automática do mínimo de 70%)
- GitHub Actions (CI)

**Front-end** (`frontend/`) — cliente de demonstração
- React 19, TypeScript e Vite (detalhes em [`frontend/README.md`](frontend/README.md))

## Arquitetura do back-end
```
controller/  → rotas HTTP, sem regra de negócio
service/     → regras de negócio (validar relacionamento, registrar dose)
repository/  → acesso ao MongoDB (Spring Data)
model/       → documentos: Paciente, Medicamento e o subdocumento RegistroDose
dto/         → entrada de operações específicas (ex.: atualizar horário)
exception/   → exceções de domínio e tratamento centralizado de erros da API
```
Erros "não encontrado" (`MedicamentoNaoEncontradoException`, `PacienteNaoEncontradoException`)
herdam de `RecursoNaoEncontradoException` e viram `404` em um único handler
(`GlobalExceptionHandler`). Tentar remover paciente com medicamentos vira `409`. Erros de
validação (`@Valid`) viram `400` com o corpo `{ "campo": "mensagem" }`.

## Banco de dados NoSQL

### Coleções
| Coleção | Função |
|---|---|
| `pacientes` | Pessoas acompanhadas: `nome`, `contato`, `dataNascimento` (opcional) |
| `medicamentos` | Medicamentos de um paciente: `pacienteId`, `nomeMedicamento`, `dosagem`, `horario` (HH:mm), `tomado` e `historicoDoses` |

### Relacionamento entre coleções
```
pacientes (1) ───────< medicamentos (N)
   _id          ←      pacienteId  (referência por id, tipo string)
```
O MongoDB não garante integridade referencial, então a aplicação impõe as regras no service:
- cadastrar medicamento com `pacienteId` inexistente → `404`;
- remover paciente que ainda tem medicamentos → `409` (é preciso remover os medicamentos antes).

Escolhemos **referência** (e não embutir os medicamentos no paciente) porque o medicamento é
consultado e alterado sozinho (marcar dose, mudar horário) e a lista de um paciente pode crescer.

### Objeto complexo: `historicoDoses`
Lista de subdocumentos embutida em cada medicamento. Cada chamada a
`PATCH /medicamentos/{id}/tomado` adiciona um registro `{ dataHora }`. Foi embutida porque
pertence a um único medicamento e é sempre lida junto com ele. Isso responde ao problema da
PoC: saber **quando** cada dose foi tomada, e não só o último estado.

### Exemplos de documentos
Como a API devolve (no MongoDB o `id` é o `_id` do tipo ObjectId e as datas são BSON Date):

`pacientes`
```json
{
  "id": "6ab913be42cb2d48f94d1dfc",
  "nome": "Maria Silva",
  "contato": "maria@email.com",
  "dataNascimento": "1955-03-10"
}
```

`medicamentos`
```json
{
  "id": "6ab913be42cb2d48f94d1dfd",
  "pacienteId": "6ab913be42cb2d48f94d1dfc",
  "nomeMedicamento": "Losartana",
  "dosagem": "50mg",
  "horario": "08:00",
  "tomado": true,
  "historicoDoses": [
    { "dataHora": "2026-09-27T13:01:59.659Z" },
    { "dataHora": "2026-09-27T13:01:59.731Z" }
  ]
}
```

### Criação das coleções
O script [`mongo-init/init.js`](AEP%20monitor-medicamentos/mongo-init/init.js) cria as duas coleções
com validação de schema (`$jsonSchema`, incluindo os itens do array `historicoDoses`) e um
índice em `medicamentos.pacienteId`. Ele roda sozinho na primeira vez que o container sobe
(`docker-entrypoint-initdb.d`, configurado no `docker-compose.yml`).

Para conferir direto no Mongo:
```bash
docker exec -it mongo-monitor mongosh monitor_medicamentos --eval "db.getCollectionInfos()"
```

> Se o volume `mongo-data` já existia de uma versão anterior, o script não roda de novo.
> Para recriar do zero (apaga os dados de teste, não o código):
> ```bash
> docker compose down -v
> docker compose up -d
> ```

## API REST
Swagger UI: `http://localhost:8080/swagger-ui.html`

**Pacientes** (`/pacientes`)
| Verbo | Rota | Ação | Respostas |
|---|---|---|---|
| POST | `/pacientes` | Cadastrar | 201, 400 |
| GET | `/pacientes` | Listar todos | 200 |
| GET | `/pacientes/{id}` | Buscar por id | 200, 404 |
| DELETE | `/pacientes/{id}` | Remover | 204, 404, 409 (tem medicamentos) |

**Medicamentos** (`/medicamentos`)
| Verbo | Rota | Ação | Respostas |
|---|---|---|---|
| POST | `/medicamentos` | Cadastrar (valida o paciente) | 201, 400, 404 (paciente) |
| GET | `/medicamentos` | Listar todos | 200 |
| GET | `/medicamentos/paciente/{pacienteId}` | Listar os de um paciente | 200 |
| GET | `/medicamentos/{id}` | Buscar por id | 200, 404 |
| GET | `/medicamentos/{id}/historico` | Histórico de doses | 200, 404 |
| PATCH | `/medicamentos/{id}/horario` | Atualizar horário (`HH:mm`) | 200, 400, 404 |
| PATCH | `/medicamentos/{id}/tomado` | Registrar dose tomada | 200, 404 |
| DELETE | `/medicamentos/{id}` | Remover | 204, 404 |

## Como executar

### Pré-requisitos
Java 17+, Maven 3.8+, Docker e, para o front, Node 20+.

### Back-end
```bash
cd "AEP monitor-medicamentos"
docker compose up -d
mvn spring-boot:run
```
A API sobe em `http://localhost:8080` e conecta em
`mongodb://localhost:27017/monitor_medicamentos`. Para outra instância (ex.: Atlas), defina a
variável de ambiente `MONGO_URI`.

### Front-end (opcional)
Com a API no ar, em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Abra `http://localhost:5173`. O Vite faz proxy de `/api` para `localhost:8080`, porque o
back-end não habilita CORS.

## Testes e cobertura
```bash
cd "AEP monitor-medicamentos"
mvn verify
```
- **Ferramenta:** JaCoCo 0.8.11, configurado no `pom.xml`.
- **Relatório:** `AEP monitor-medicamentos/target/site/jacoco/index.html`.
- **Gate:** o `mvn verify` falha se a cobertura de **linhas** ficar abaixo de 70%. O mesmo
  comando roda no GitHub Actions (`.github/workflows/ci.yml`) e publica o relatório como artefato.
- **Última medição:** 77 testes, 0 falhas. Instruções 96%, linhas 99% (171 de 172), branches 68%.
  As branches mais descobertas estão nos `equals`/`hashCode` do pacote `model`.
- **Testes:** `MedicamentoTest` (18), `PacienteTest` (8), `RegistroDoseTest` (5),
  `MedicamentoServiceTest` (12), `PacienteServiceTest` (7), `MedicamentoControllerTest` (19) e
  `PacienteControllerTest` (8).

**Escopo da cobertura:** a PoC medida é a API com o banco (`AEP monitor-medicamentos/`),
excluída apenas a classe `main`. O front-end é um cliente de demonstração da API e **não possui
testes automatizados**; o CI apenas verifica que ele compila (`npm run build`).

## Metodologia de trabalho
Kanban simples, com as tarefas das duas entregas e o que ainda falta em
[`QUADRO_DE_TAREFAS.md`](QUADRO_DE_TAREFAS.md).

## Versões das entregas
| Entrega | Identificação |
|---|---|
| 1ª entrega | Estado do repositório na primeira publicação (coleção única `medicamentos`) |
| 2ª entrega | Tag `v2.0.0` |

## Estrutura do projeto
```
.
├── README.md
├── QUADRO_DE_TAREFAS.md
├── .github/workflows/ci.yml
├── AEP monitor-medicamentos/          (back-end)
│   ├── pom.xml
│   ├── docker-compose.yml
│   ├── mongo-init/init.js
│   └── src/
│       ├── main/java/com/aep/monitor/
│       │   ├── MonitorMedicamentosApplication.java
│       │   ├── controller/   MedicamentoController, PacienteController
│       │   ├── service/      MedicamentoService, PacienteService
│       │   ├── repository/   MedicamentoRepository, PacienteRepository
│       │   ├── model/        Medicamento, Paciente, RegistroDose
│       │   ├── dto/          AtualizarHorarioRequest
│       │   └── exception/    RecursoNaoEncontradoException (+ 2 filhas),
│       │                     PacienteComMedicamentosVinculadosException, GlobalExceptionHandler
│       ├── main/resources/application.properties
│       └── test/java/com/aep/monitor/   testes de model, service e controller
└── frontend/                          (React + Vite)
```

## Limitações conhecidas
- A flag `tomado` não volta a `false`; o front calcula "tomado hoje" a partir de `historicoDoses`.
- Não há trava contra registrar a mesma dose duas vezes (cada `PATCH /tomado` adiciona um registro).
- Sem autenticação e sem CORS (o front depende do proxy do Vite).
- O front-end não tem testes automatizados.
