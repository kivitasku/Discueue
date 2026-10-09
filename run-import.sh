#!/bin/bash

echo "Starting music import..."

cd "$(dirname "$0")/back" || exit 1

npx tsx scripts/runImport.ts

