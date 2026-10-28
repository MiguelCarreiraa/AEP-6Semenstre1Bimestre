# DoseCerta — Front-end

Interface web no estilo iOS para a API Spring Boot em `../AEP monitor-medicamentos`.
A marca (logo em `src/components/Logo.tsx`, ícone da aba em `public/favicon.svg`) é uma cápsula
com um selo verde de confirmação: a "dose" e a "certa".

## Stack
- **React 19 + TypeScript + Vite**
- **motion** — molas e gesto de arrastar do bottom sheet
- **sonner** — toasts (inclusive "Desfazer" ao remover)
- **zustand** — estado global (pacientes, medicamentos, sheet aberto)
- **clsx** — classes condicionais

Bibliotecas escolhidas a partir da skill `pick-ui-library`; design e movimento
seguem as skills `apple-design`, `emil-design-eng` e `mobile-native` de
[emilkowalski/skills](https://github.com/emilkowalski/skills).

## Como rodar
1. Suba o MongoDB e a API (na pasta do backend):
   ```bash
   docker compose up -d
   mvn spring-boot:run
   ```
2. Em outro terminal, nesta pasta:
   ```bash
   npm install
   npm run dev
   ```
3. Abra `http://localhost:5173`.

O backend não tem CORS habilitado, então o Vite faz proxy: o front chama
`/api/...` e o dev server repassa para `http://localhost:8080/...`.
Para apontar para outra API: `API_URL=http://host:porta npm run dev`.

## Telas
- **Hoje** — agenda do dia agrupada por período (manhã/tarde/noite), anel de
  progresso, próxima dose, doses atrasadas e filtro por paciente. Um toque no
  círculo registra a dose (`PATCH /medicamentos/{id}/tomado`).
- **Pacientes** — lista com idade e número de medicamentos.
- **Sheets** — novo paciente, novo medicamento, detalhes do medicamento
  (editar horário, histórico de doses, remover) e detalhes do paciente.

## Decisões de design
| Decisão | Por quê |
| --- | --- |
| "Tomado hoje" vem de `historicoDoses` com data de hoje, não da flag `tomado` | A flag nunca volta a `false` no backend; o histórico permite a agenda diária |
| Remover = some na hora + toast "Desfazer" por 5s | Apple: perdão (undo) em vez de diálogo de confirmação |
| Bottom sheet arrastável com projeção de velocidade | Um "flick" curto fecha, como no iOS |
| Mola sem bounce na abertura (`bounce: 0`) | Bounce só quando o gesto trouxe momento |
| Barra de navegação translúcida só quando há conteúdo por baixo | Scroll edge effect em vez de divisória fixa |
| Hover só com `(hover: hover) and (pointer: fine)` | Evita hover "preso" após toque no celular |
| Inputs com 16px | Evita zoom automático do iOS |
| Troca de aba sem animação | Ação frequente: animar deixaria lenta |
| Respeita `prefers-reduced-motion`, `prefers-reduced-transparency` e `prefers-contrast` | Acessibilidade |
