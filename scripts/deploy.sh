#!/usr/bin/env bash

set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$script_dir/.." && pwd)

cd "$repo_root"

compose_file=${COMPOSE_FILE:-docker-compose.yml}
previous_commit=$(git rev-parse HEAD)

if [[ -n $(git status --porcelain) ]]; then
  echo "Repository has uncommitted changes. Deployment aborted to keep the update path safe." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  compose_cmd=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  compose_cmd=(docker-compose)
else
  echo "Docker Compose is required but was not found." >&2
  exit 1
fi

print_logs() {
  echo "===== Deployment Logs ====="
  if "${compose_cmd[@]}" -f "$compose_file" ps >/dev/null 2>&1; then
    "${compose_cmd[@]}" -f "$compose_file" logs --no-color --tail=100 || true
  else
    echo "No running compose services were found."
  fi
}

rollback() {
  echo "Attempting rollback to ${previous_commit}..."
  set +e

  git reset --hard "$previous_commit" >/dev/null 2>&1

  if docker compose version >/dev/null 2>&1; then
    docker compose -f "$compose_file" up -d --remove-orphans >/dev/null 2>&1
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$compose_file" up -d --remove-orphans >/dev/null 2>&1
  fi

  set -e
}

on_error() {
  exit_code=$?
  echo "Deployment failed." >&2
  rollback
  print_logs
  exit "$exit_code"
}

trap on_error ERR

echo "Pulling latest GitHub code..."
git fetch --prune origin
git pull --ff-only

echo "Building Vendora Docker images..."
echo "Stopping existing Docker containers..."
"${compose_cmd[@]}" -f "$compose_file" down --remove-orphans

echo "Removing unused Docker images..."
docker image prune -f

echo "Rebuilding Docker containers..."
"${compose_cmd[@]}" -f "$compose_file" build --pull

echo "Starting containers in detached mode..."
"${compose_cmd[@]}" -f "$compose_file" up -d --remove-orphans

print_logs

echo "Deployment complete."