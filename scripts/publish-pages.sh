#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm run check
npm test
git diff --exit-code --quiet
git diff --cached --exit-code --quiet
pages_commit=$(git subtree split --prefix web HEAD)
git push origin "$pages_commit:refs/heads/gh-pages"
