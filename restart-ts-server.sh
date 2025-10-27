#!/bin/bash

# Find the TypeScript server process and restart it
pkill -f "typescript.*language-server"
echo "TypeScript server restarted. Please save a file to trigger TypeScript language features."
