#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

npm install --force --global corepack
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
