#!/bin/bash
NODE_PATH=$(which node 2>/dev/null)
if [ -z "$NODE_PATH" ]; then
    echo "NODE_NOT_FOUND"
    exit 1
else
    echo "$NODE_PATH"
    node --version
    exit 0
fi
