#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

pnpm lint $*
pnpm prettier $*
