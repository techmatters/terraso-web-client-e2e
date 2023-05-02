 #!/bin/bash

PARAMS="$1"
COMMAND="$2"

# Define specific folders and files to mount from local dev
# to improve start performance
toMount="scripts src test-results playwright-report .eslintrc .prettierrc package.json package-lock.json playwright.config.ts"
volumes=""
for entry in $toMount
do
  volumes="${volumes} -v ${PWD}/${entry}:/app/${entry}"
done

docker run \
    -it \
    --rm \
    --network host \
    --env-file ${PWD}/.env \
    $volumes \
    $PARAMS \
    techmatters/terraso_web_client_e2e \
    bash -c "$COMMAND"
