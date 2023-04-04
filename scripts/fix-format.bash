#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

pnpm fix $*
pnpm format $*
