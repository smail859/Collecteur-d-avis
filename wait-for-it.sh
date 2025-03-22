#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

# Copié depuis : https://github.com/vishnubob/wait-for-it

set -e

host="$1"
shift
port="$1"
shift

timeout=15

until nc -z "$host" "$port"; do
  >&2 echo "🕒 Attente de $host:$port..."
  sleep 1
  timeout=$((timeout - 1))
  if [ $timeout -le 0 ]; then
    >&2 echo "❌ Timeout atteint en attendant $host:$port"
    exit 1
  fi
done

>&2 echo "✅ $host:$port est disponible !"
exec "$@"
