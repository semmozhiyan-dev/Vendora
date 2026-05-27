#!/usr/bin/env bash

set -euo pipefail

healthcheck_url=${HEALTHCHECK_URL:-http://127.0.0.1/health}
max_attempts=${HEALTHCHECK_MAX_ATTEMPTS:-30}
sleep_seconds=${HEALTHCHECK_SLEEP_SECONDS:-5}
backend_container=${BACKEND_CONTAINER_NAME:-vendora-backend}
frontend_container=${FRONTEND_CONTAINER_NAME:-vendora-frontend}
nginx_container=${NGINX_CONTAINER_NAME:-vendora-nginx}
mongodb_primary_container=${MONGODB_CONTAINER_NAME:-mongodb}
mongodb_fallback_container=${MONGODB_FALLBACK_CONTAINER_NAME:-vendora-mongodb}

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required for the health check." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required for the health check." >&2
  exit 1
fi

container_exists() {
  docker inspect "$1" >/dev/null 2>&1
}

container_status() {
  docker inspect --format '{{.State.Status}}' "$1" 2>/dev/null || true
}

container_health() {
  docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$1" 2>/dev/null || true
}

check_container_running() {
  name=$1
  label=$2

  if ! container_exists "$name"; then
    echo "[FAIL] ${label}: container '${name}' not found"
    return 1
  fi

  status=$(container_status "$name")
  if [[ "$status" != "running" ]]; then
    echo "[FAIL] ${label}: container '${name}' is '${status:-unknown}'"
    return 1
  fi

  echo "[OK] ${label}: container '${name}' is running"
}

check_mongodb_health() {
  local name=$1

  if ! container_exists "$name"; then
    return 1
  fi

  status=$(container_status "$name")
  health=$(container_health "$name")

  if [[ "$status" != "running" ]]; then
    echo "[FAIL] MongoDB: container '${name}' is '${status:-unknown}'"
    return 1
  fi

  if [[ "$health" != "healthy" ]]; then
    echo "[FAIL] MongoDB: container '${name}' health is '${health:-unknown}'"
    return 1
  fi

  echo "[OK] MongoDB: container '${name}' is healthy"
}

print_container_logs() {
  target=$1
  echo "----- ${target} logs (tail 30) -----"
  docker logs --tail 30 "$target" 2>&1 || true
}

trap 'exit_code=$?; echo "Health check failed. Dumping container logs..."; print_container_logs "$backend_container"; print_container_logs "$frontend_container"; print_container_logs "$nginx_container"; if container_exists "$mongodb_primary_container"; then print_container_logs "$mongodb_primary_container"; elif container_exists "$mongodb_fallback_container"; then print_container_logs "$mongodb_fallback_container"; fi; exit "$exit_code"' ERR

echo "===== Container Status ====="
check_container_running "$backend_container" "Backend"
check_container_running "$frontend_container" "Frontend"
check_container_running "$nginx_container" "Nginx"

echo "===== MongoDB Status ====="
if container_exists "$mongodb_primary_container"; then
  check_mongodb_health "$mongodb_primary_container"
elif container_exists "$mongodb_fallback_container"; then
  check_mongodb_health "$mongodb_fallback_container"
else
  echo "[FAIL] MongoDB: neither '${mongodb_primary_container}' nor '${mongodb_fallback_container}' was found"
  exit 1
fi

echo "Checking deployment health at ${healthcheck_url}..."

for attempt in $(seq 1 "$max_attempts"); do
  if response=$(curl --silent --show-error --fail "$healthcheck_url"); then
    if printf '%s' "$response" | grep -q '"status":"OK"'; then
      echo "[OK] API endpoint returned a healthy response."
      exit 0
    fi

    echo "[FAIL] API endpoint responded, but the payload was unexpected:"
    printf '%s\n' "$response"
    exit 1
  fi

  echo "[WARN] Attempt ${attempt}/${max_attempts} failed. Retrying in ${sleep_seconds}s..."
  sleep "$sleep_seconds"
done

echo "[FAIL] Health check failed after ${max_attempts} attempts." >&2
exit 1