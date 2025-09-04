#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-tic-tac-toe-101825-101834/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

