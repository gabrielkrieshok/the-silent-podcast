# The Silent Podcast

The site has been built using Jekyll. Individual posts for each episode power the RSS for subscriptions.

The site design was created using [Jekyll Skeleton](https://github.com/timklapdor/jekyll-skeleton).

```bash
bundle exec rake build
bundle exec jekyll serve
```


{
  "exclude": [
    "vendor"
  ],
  "language": "ruby",
  "os": [
    "linux"
  ],
  "dist": "xenial",
  "rvm": [
    "2.6.3"
  ],
  "script": [
    "chmod +x ./script/jekyll-rebuild.sh && ./script/jekyll-rebuild.sh"
  ],
  "branches": {
    "only": [
      "main"
    ]
  },
  "cache": {
    "bundler": true
  },
  "notifications": {
    "email": [
      {
        "enabled": false
      }
    ]
  }
}



language: ruby
rvm:
  - 2.6.3

# Assume bundler is being used, therefore
# the `install` step will run `bundle install` by default.
script: chmod +x ./script/jekyll-rebuild.sh && ./script/jekyll-rebuild.sh
exclude: [vendor]

# branch whitelist, only for GitHub Pages
branches:
  only:
  - main     # test the main branch

cache: bundler # caching bundler gem packages will speed up build

# Optional: disable email notifications about the outcome of your builds
notifications:
  email: false
