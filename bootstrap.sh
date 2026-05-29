#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

echo "Setting up Raven OS dev environment..."

if [[ ! -f package.json ]]; then
  echo "Error: package.json not found in $(pwd)"
  exit 1
fi

npm install

echo ""
echo "Bootstrap complete."
echo "Run: npm run dev"
