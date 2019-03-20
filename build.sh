#!/bin/bash

npx babel src/flow/ -d dist/
cp src/* dist/ || true
