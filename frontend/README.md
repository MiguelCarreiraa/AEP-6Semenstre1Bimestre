# DoseCerta — Front-end

Interface web (dashboard minimalista) para a API Spring Boot em `../AEP monitor-medicamentos`.
A marca (logo em `src/components/Logo.tsx`, ícone da aba em `public/favicon.svg`) é uma cápsula
com um selo verde de confirmação: a "dose" e a "certa".

## Stack
- **React 19 + TypeScript + Vite**
- **motion** — animações curtas do painel lateral e do bottom sheet
- **sonner** — toasts (inclusive "Desfazer" ao remover)
- **zustand** — estado global (pacientes, medicamentos, sheet aberto)
- **clsx** — classes condicionais

Tipografia: **Inter** (carregada pelo Google Fonts em `index.html`, com fallback para a fonte do sistema).

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
- **Hoje** — resumo do dia (doses tomadas, próxima dose, doses em atraso), filtro por
  paciente e agenda agrupada por período. O botão **Registrar** marca a dose
  (`PATCH /medicamentos/{id}/tomado`).
- **Pacientes** — tabela com contato, quantidade de medicamentos e idade.
- **Painéis** — novo paciente, novo medicamento, detalhes do medicamento (editar horário,
  histórico de doses, remover) e detalhes do paciente. No desktop abrem como painel
  lateral; no celular, como bottom sheet arrastável.

## Identidade visual
Todos os tokens (cores, raios, sombras) ficam no topo de `src/styles.css`.

| Token | Valor |
| --- | --- |
| Fundo / cartões | `#F5F7FA` / `#FFFFFF` |
| Azul principal / suave | `#2563EB` / `#EFF6FF` |
| Texto / texto secundário | `#17212F` / `#64748B` |
| Bordas | `#E5EAF0` |
| Confirmação / destrutivo | `#16A36D` / `#DC5454` |

## Decisões de UX
| Decisão | Por quê |
| --- | --- |
| Sidebar no desktop, barra inferior no celular | É o mesmo componente (`Sidebar`); só o CSS muda a disposição |
| "Tomado hoje" vem de `historicoDoses` com data de hoje, não da flag `tomado` | A flag nunca volta a `false` no backend; o histórico permite a agenda diária |
| Remover = some na hora + toast "Desfazer" por 5s | Perdão (undo) em vez de diálogo de confirmação |
| Hover só com `(hover: hover) and (pointer: fine)` | Evita hover "preso" após toque no celular |
| Inputs com 16px no celular | Evita zoom automático do iOS |
| Respeita `prefers-reduced-motion` | Acessibilidade |
