#!/bin/bash

set -e

git fetch https://github.com/kiki-core-stack/admin-backend main
git merge FETCH_HEAD
