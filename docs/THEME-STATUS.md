# Sistema de temas — resumo histórico S0–S9 (07/10/2026)

> **Estado atual: `HANDOFF.md` §1 e `ACTION-PLAN.md` §1.** Esta página só resume a fase S0–S9.

| Sessão | Estado | Evidência |
|---|---|---|
| S0 lockfile/baseline | ✅ | `npm ci` funciona; baseline commitado |
| S1 tokens + contraste | ✅ | `npm run contrast` AA nos 2 temas |
| S2 motor de tema | ✅ | 22 testes Vitest |
| S3 controles + Settings | ✅ | e2e: toggle, persistência, Sistema, Settings |
| S4–S8 migração R1–R8 | ✅ | lint com 0 violações; 9 rotas conferidas nos 2 temas |
| S9 a11y/QA/CI | ✅ | 23 testes Playwright + axe na época (hoje 105 listados; ver HANDOFF §1); workflow em `.github/workflows/ci.yml` |

Regressão do escuro: diff de pixels vs baseline = 0,4–1,2% por rota, só nas mudanças intencionais.

## Pendente (não verificado no sandbox)
- `next build` completo (Google Fonts bloqueado no sandbox) — rode `npm run build` localmente.
- Safari/iOS e fonte Geist real.
- Gate de screenshots (`toHaveScreenshot`) ainda não está no repositório (N2).
- Exportação PNG/PDF no claro: já revisada visualmente (N1, `e2e/export.spec.ts`).
