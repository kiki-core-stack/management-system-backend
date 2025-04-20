#!/bin/bash

set -e

git fetch https://github.com/kiki-kanri/auto-hono main
git merge FETCH_HEAD
