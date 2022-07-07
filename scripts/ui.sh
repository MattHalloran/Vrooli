#!/bin/sh

# TODO hacky. wait-for.sh is better, but node slim does not support it yet.
# If in production, set timeout to wait for backend to start. 
# Development startup takes long enough that no wait is needed
if [ "${NODE_ENV}" = "production" ]; then
    echo 'Waiting for backend to start...'
    timeout=100
fi
echo 'Starting app...'

cd ${PROJECT_DIR}/packages/ui

# Determine which favicons to use TODO this doesn't work, and doesn't account for build folder (which should be checked if it exists if in production)
# Use dev version if NODE_ENV is development or REACT_APP_SERVER_LOCATION is local. 
# User prod version otherwise
if [ "${NODE_ENV}" = "development" ] || [ "${REACT_APP_SERVER_LOCATION}" = "local" ]; then
    cp -p ${PROJECT_DIR}/packages/ui/public/dev/* ${PROJECT_DIR}/packages/ui/public/
    echo "Using development favicons"
else
    cp -p ${PROJECT_DIR}/packages/ui/public/prod/* ${PROJECT_DIR}/packages/ui/public/
    echo "Using production favicons"
fi

# Finally, start project
yarn start-${NODE_ENV}