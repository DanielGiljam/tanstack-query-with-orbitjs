#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

find apps libs -name tsconfig.tsbuildinfo -print -delete
rm -rf dist/out-tsc
