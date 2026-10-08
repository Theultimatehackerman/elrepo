#!/bin/bash
# SANDBOX SEM REDE: `next build` com as fontes do Google mockadas (a Geist real só existe na sua máquina/CI).
# Verifica TypeScript, prerender e tabela de rotas. NÃO verifica o bundle do Turbopack (o mock não funciona nele; por isso --webpack)
# nem a fonte real. Uso:  setsid nohup bash scripts/sandbox/build-mocked.sh > /dev/null 2>&1 &   → lê /tmp/build.log e /tmp/build-status
cd "$(dirname "$0")/../.." || exit 1
rm -rf .next
NEXT_FONT_GOOGLE_MOCKED_RESPONSES="$PWD/scripts/sandbox/font-mock.js" npx next build --webpack > /tmp/build.log 2>&1
echo "DONE exit=$?" > /tmp/build-status
