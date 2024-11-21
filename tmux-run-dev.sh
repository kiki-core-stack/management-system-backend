#!/bin/bash

name='kiki-core-stack-admin-backend'

if ! tmux ls | grep -q "^$name:"; then
    tmux new-session -ds "$name"
    tmux send-keys -t "$name" 'bun run dev' C-m
fi
