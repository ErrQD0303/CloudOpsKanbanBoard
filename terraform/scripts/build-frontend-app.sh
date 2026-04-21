#!/usr/bin/bash

# This script is responsible for building the frontend application using npm. It should be run from the root of the project directory.
# From this directory, you can run the following command to build the frontend application:
cd ../ClientApp
export PATH="/c/Users/ADMIN/AppData/Roaming/nvm/v22.12.0:/c/Program Files/nodejs:$PATH"
npm install
npm run build
mv dist ../terraform/dist
cd ../terraform