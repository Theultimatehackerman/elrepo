#!/bin/bash
# SANDBOX: roda a suíte e2e como o job `e2e` do CI (CI=1) contra `next start` do build mockado (rode build-mocked.sh antes).
# Uso:  setsid nohup bash scripts/sandbox/prod-e2e.sh > /dev/null 2>&1 &   → /tmp/prod-status, /tmp/prod-codes.txt, /tmp/prod-e2e.log
# Esperado (08/10/2026): 103 passed + 5 skipped (vitrine só em dev), exit 0, ~9–10 min. O servidor é encerrado ao fim.
cd "$(dirname "$0")/../.." || exit 1
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
rm -f /tmp/prod-status; setsid nohup npx next start -p 3100 > /tmp/start.log 2>&1 & SP=$!
for i in $(seq 1 30); do curl -s -o /dev/null -m 5 http://localhost:3100/login && break; sleep 2; done
: > /tmp/prod-codes.txt
for r in / /login /register /dashboard /calendar /content /clients /campaigns /approvals /settings /dev/theme /rota-inexistente; do
  echo "$r $(curl -s -o /dev/null -m 30 -w '%{http_code}' http://localhost:3100$r)" >> /tmp/prod-codes.txt; done
echo CODES-DONE > /tmp/prod-status
BASE=http://localhost:3100 node scripts/sandbox/hydration-check.mjs > /tmp/prod-hydration.log 2>&1; echo "hydration exit=$?" >> /tmp/prod-status
npx playwright test -c playwright.prod.config.ts --workers=2 --reporter=line > /tmp/prod-e2e.log 2>&1
echo "DONE exit=$?" >> /tmp/prod-status
kill $SP 2>/dev/null
