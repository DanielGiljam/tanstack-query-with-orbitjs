#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

find apps -name .docusaurus -print -delete
