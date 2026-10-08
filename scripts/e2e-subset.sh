#!/bin/bash
# Roda SÓ alguns specs do Playwright num único script (servidor + aquecimento + testes + status em arquivo).
# Uso:  bash scripts/e2e-subset.sh <arquivo-status> <arquivo-log> <repeat-each> <args do playwright...>
# Ex.:  bash scripts/e2e-subset.sh /tmp/st /tmp/lg 10 e2e/theme.spec.ts -g "L16"
# Rode em background:  setsid nohup bash scripts/e2e-subset.sh ... &   e releia o log; sem "DONE exit=N" em <status> = não acabou.
# O dev server fica de pé na porta 3100 ao fim: encerre por PID (`ss -ltnp | grep 3100`), NUNCA com `pkill -f`.
ST=$1; LG=$2; N=$3; shift 3
cd "$(dirname "$0")/.." || exit 1
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
setsid nohup npm run dev -- -p 3100 > /tmp/dev.log 2>&1 &
for i in $(seq 1 30); do curl -s -o /dev/null -m 5 http://localhost:3100/login && break; sleep 2; done
for r in / /login /dashboard /dev/theme /settings; do curl -s -o /dev/null -m 120 "http://localhost:3100$r"; done
echo WARM-DONE > "$ST"
npx playwright test "$@" --repeat-each="$N" --workers=2 --reporter=line > "$LG" 2>&1
echo "DONE exit=$?" >> "$ST"
