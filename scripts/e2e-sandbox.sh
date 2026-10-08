#!/bin/bash
# Roda dev server + aquecimento de rotas + suíte e2e completa, tudo num processo só (sobrevive melhor no sandbox).
# Uso (a partir da raiz do projeto):
#   rm -f /tmp/e2e-status; setsid nohup bash scripts/e2e-sandbox.sh > /tmp/run-all.out 2>&1 &
# Acompanhar:  cat /tmp/e2e-status ; sed 's/\x1b\[[0-9;]*[A-Za-z]//g' /tmp/e2e-full.log | tail -5
# /tmp/e2e-status: "WARM-DONE" (servidor aquecido) e depois "DONE exit=<código>" (só aí há resultado).
# Sem "DONE" e com o log parado = o processo morreu: REINICIE, não conclua nada.
# Atenção: o Playwright apaga test-results/ a cada execução; copie exports/capturas antes de reexecutar.
cd "$(dirname "$0")/.." || exit 1
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
PORT="${PORT:-3100}"
setsid nohup npm run dev -- -p "$PORT" > /tmp/dev.log 2>&1 &
for i in $(seq 1 30); do curl -s -o /dev/null -m 5 "http://localhost:$PORT/login" && break; sleep 2; done
for r in / /login /register /dashboard /content /calendar /clients /campaigns /approvals /settings \
         /content/content_1 /clients/client_acme /campaigns/campaign_black_friday /review/content_1 /rota-que-nao-existe; do
  curl -s -o /dev/null -m 120 "http://localhost:$PORT$r"
done
echo WARM-DONE > /tmp/e2e-status
npx playwright test --workers=2 --reporter=line > /tmp/e2e-full.log 2>&1
echo "DONE exit=$?" >> /tmp/e2e-status
# Encerrar o servidor por PORTA/PID (nunca `pkill -f`): descubra o PID em /proc ou com `ps aux | grep '[n]ext'`.
