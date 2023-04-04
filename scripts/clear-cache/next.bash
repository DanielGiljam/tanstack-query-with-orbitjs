#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

find apps -name .next -print -delete
