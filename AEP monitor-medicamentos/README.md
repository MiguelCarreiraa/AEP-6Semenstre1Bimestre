# Monitor de Medicamentos — Back-end

API REST (Java 17, Spring Boot 3) com MongoDB. A documentação completa do projeto — problema,
ODS, modelo do banco (coleções `pacientes` e `medicamentos`, relacionamento e histórico de
doses), endpoints, cobertura e limitações — está no [README da raiz](../README.md).

## Executar
```bash
docker compose up -d
mvn spring-boot:run
```
Swagger UI: `http://localhost:8080/swagger-ui.html`

## Testes e cobertura
```bash
mvn verify
```
Roda os testes, gera o relatório JaCoCo em `target/site/jacoco/index.html` e falha o build se a
cobertura de linhas ficar abaixo de 70%.

## Banco de dados
As coleções são criadas por [`mongo-init/init.js`](mongo-init/init.js) na primeira vez que o
container sobe. Para recriar do zero (apaga os dados de teste):
```bash
docker compose down -v
docker compose up -d
```
