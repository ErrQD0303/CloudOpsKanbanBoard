#!/usr/bin/bash

cd ../ClientApp
export PATH="/c/Users/ADMIN/AppData/Roaming/nvm/v22.12.0:/c/Program Files/nodejs:$PATH"
npm install
npm run build
mv dist ../terraform/dist
cd ../terraform