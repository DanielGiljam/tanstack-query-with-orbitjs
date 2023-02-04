#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

pnpm type-check $*
pnpm fix $*
pnpm format $*
