# Quadro de Tarefas — Monitor de Medicamentos

## Metodologia

Kanban simples, com uma coluna por estágio: **Backlog → Em andamento → Concluído**.

O trabalho foi dividido em duas entregas incrementais. Cada tarefa foi movida para Concluído após atender à definição de pronto:

1. Código funcionando e testado.
2. `mvn verify` executado com sucesso, com todos os testes passando e cobertura de linhas igual ou superior a 70%.
3. README atualizado quando a tarefa altera o comportamento do sistema ou a estrutura do banco de dados.

## Backlog

_Nenhuma tarefa pendente._

## Em andamento

_Nenhuma tarefa em andamento._

## Concluído

### 1ª Entrega

- [x] Definir o problema, o público-alvo e o ODS 3.
- [x] Modelar a coleção única `medicamentos` e criá-la via `mongo-init/init.js`, com validação de schema.
- [x] Desenvolver a API REST de medicamentos: cadastrar, listar, buscar, atualizar horário, marcar como tomado e remover.
- [x] Documentar os endpoints da API utilizando Swagger.
- [x] Implementar a validação do horário no formato `HH:mm`.
- [x] Implementar a camada de service e o tratamento centralizado de erros (`GlobalExceptionHandler`).
- [x] Desenvolver testes automatizados com JaCoCo.
- [x] Configurar o gate de cobertura mínima de 70% no `mvn verify`.
- [x] Configurar a integração contínua (CI) no GitHub Actions.

### 2ª Entrega

- [x] Comparar a primeira entrega com os requisitos da segunda e definir o plano de evolução.
- [x] Implementar a coleção `pacientes`, incluindo model, repository, service, controller e testes.
- [x] Implementar o relacionamento `medicamentos.pacienteId` → `pacientes._id`.
- [x] Validar a existência do paciente no cadastro de medicamentos, retornando HTTP 404 quando não encontrado.
- [x] Impedir a remoção de pacientes que possuam medicamentos vinculados, retornando HTTP 409.
- [x] Implementar os subdocumentos `historicoDoses`.
- [x] Criar o endpoint `GET /medicamentos/{id}/historico`.
- [x] Criar a exceção base `RecursoNaoEncontradoException` para reduzir duplicações no tratamento de erros.
- [x] Atualizar `mongo-init/init.js` com as duas coleções e o schema do array de subdocumentos.
- [x] Ampliar os testes automatizados para 77 testes.
- [x] Atingir 96% de cobertura de instruções e 99% de cobertura de linhas.
- [x] Validar o fluxo completo utilizando MongoDB real: paciente → medicamento → doses → histórico → remoções.
- [x] Desenvolver o front-end em React integrado à API.
- [x] Implementar as telas de agenda do dia, pacientes, medicamentos e histórico.
- [x] Corrigir o CI para executar na raiz do repositório e compilar também o front-end.
- [x] Atualizar o README com a estrutura do banco de dados da segunda entrega e o quadro de tarefas.

### Documentação e Finalização

- [x] Documentar a versão final do projeto.
- [x] Gravar o vídeo de apresentação da segunda entrega (3 a 5 minutos).
- [x] Publicar a versão final identificada pela tag `v2.0.0`.
- [x] Finalizar a documentação do projeto no arquivo `QUADRO_DE_TAREFAS.md`.
- [x] Consolidar as alterações finais do projeto em commit.

### Melhorias e itens opcionais

- [x] Avaliar a possibilidade de implementar testes automatizados do front-end com Vitest.
- [x] Identificar a necessidade de impedir o registro duplicado de uma dose no mesmo horário.

## Critérios de conclusão do projeto

O projeto é considerado concluído após:

- [x] Implementação das funcionalidades previstas nas duas entregas.
- [x] Integração entre front-end, back-end e MongoDB.
- [x] Testes automatizados e análise de cobertura.
- [x] Cobertura de linhas superior ao mínimo exigido de 70%.
- [x] Integração contínua configurada no GitHub Actions.
- [x] Documentação atualizada.
- [x] Versão final identificada pela tag `v2.0.0`.

## Versão Final

**Versão:** `v2.0.0`

**Projeto:** Monitor de Medicamentos — DoseCerta

**Status:** Concluído.

**Tecnologias principais:**
- Java 17
- Spring Boot 3
- React
- TypeScript
- MongoDB
- Maven
- JUnit 5
- Mockito
- JaCoCo
- GitHub Actions

---

_Quadro atualizado para registrar a conclusão das atividades previstas nas duas entregas do projeto._
