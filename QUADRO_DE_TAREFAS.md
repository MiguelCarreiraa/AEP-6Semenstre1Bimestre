# Quadro de tarefas — Monitor de Medicamentos

## Metodologia
Kanban simples, com uma coluna por estágio: **Backlog → Em andamento → Concluído**. O trabalho
foi dividido em duas entregas incrementais, e cada tarefa só vai para Concluído quando cumpre a
definição de pronto:

1. código funcionando e testado;
2. `mvn verify` verde (todos os testes passando e cobertura de linhas ≥ 70%);
3. README atualizado quando a tarefa muda o comportamento ou o banco.

## Backlog
- [ ] Gravar o vídeo da 2ª entrega (3 a 5 minutos)
- [ ] Publicar a versão final identificada (tag `v2.0.0`)
- [ ] Espelhar este quadro no GitHub Projects (ou Trello) e anexar o print/link como evidência
- [ ] (Opcional) Testes automatizados do front-end com Vitest
- [ ] (Melhoria identificada) Impedir o registro duplicado de uma dose no mesmo horário

## Em andamento
_Nenhuma tarefa em andamento._

## Concluído

### 1ª entrega
- [x] Definir problema, público-alvo e ODS 3
- [x] Modelar a coleção única `medicamentos` e criá-la via `mongo-init/init.js` com validação de schema
- [x] API REST de medicamentos (cadastrar, listar, buscar, atualizar horário, marcar como tomado, remover) com Swagger
- [x] Validação do horário no formato `HH:mm`
- [x] Camada de service e tratamento centralizado de erros (`GlobalExceptionHandler`)
- [x] Testes automatizados com JaCoCo, gate de 70% no `mvn verify` e CI no GitHub Actions

### 2ª entrega
- [x] Comparar a 1ª entrega com os requisitos da 2ª e definir o plano de evolução
- [x] Coleção `pacientes` (model, repository, service, controller e testes)
- [x] Relacionamento `medicamentos.pacienteId` → `pacientes._id`, validado no cadastro (`404`) e na remoção do paciente (`409`)
- [x] Subdocumentos `historicoDoses` e endpoint `GET /medicamentos/{id}/historico`
- [x] Exceção base `RecursoNaoEncontradoException` para remover duplicação no handler de erros
- [x] Atualizar `mongo-init/init.js` com as duas coleções e o schema do array de subdocumentos
- [x] Ampliar os testes para 77, com cobertura de 96% (instruções) e 99% (linhas)
- [x] Validar o fluxo completo com MongoDB real (paciente → medicamento → doses → histórico → remoções)
- [x] Front-end React integrado à API (agenda do dia, pacientes, medicamentos e histórico)
- [x] Corrigir o CI para rodar na raiz do repositório e compilar também o front-end
- [x] Atualizar o README com a estrutura do banco da 2ª entrega e este quadro
