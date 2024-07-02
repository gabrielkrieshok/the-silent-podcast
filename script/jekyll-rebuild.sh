#!/bin/bash

# skip if build is triggered by pull request
if [ "${GITHUB_EVENT_NAME}" == "pull_request" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

# cleanup "_site"
rm -rf _site
mkdir _site

# clone remote repo to "_site"
git clone https://${GH_TOKEN}@github.com/gabrielkrieshok/thesilentpodcast --branch main _site

# build with Jekyll into "_site"
# exec jekyll build
# bundle exec rake site:deploy

# bundle exec rake post

# push empty commit
cd _site
git config user.email "gabriel.krieshok@gmail.com"
git config user.name "gabrielkrieshok"
git commit -a -m "rebuild pages" --allow-empty
git push origin main

# remove last empty commit
git reset HEAD~
git push origin main --force
