#!/bin/bash

set -euo pipefail

SCRIPTS_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
cd "${SCRIPTS_DIR}"

git fetch https://github.com/kiki-core-stack/base-backend main
git merge FETCH_HEAD
