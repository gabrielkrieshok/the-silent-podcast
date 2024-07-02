#!/bin/bash

# Skip if build is triggered by pull request
if [ "${GITHUB_EVENT_NAME}" == "pull_request" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# Enable error reporting to the console
set -e

# Cleanup "_site"
rm -rf _site
mkdir _site

# Build with Jekyll into "_site"
bundle exec jekyll build -d _site
