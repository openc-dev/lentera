#!/usr/bin/env bash
set -e

cleanup() {
  echo ""
  echo "Shutting down..."
  kill "$BACKEND_PID" 2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

cd "$(dirname "$0")"

(cd lentera-backend && php artisan serve --host=0.0.0.0 --port=8000) &
BACKEND_PID=$!

(cd lentera-frontend && npm run dev) &
FRONTEND_PID=$!

echo "Backend  : http://localhost:8000"
echo "Frontend : http://localhost:3000"
echo "Press Ctrl+C to stop both services."

wait
