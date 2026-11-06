#!/bin/sh
set -eu

root_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
profile_dir=$(mktemp -d)
trap 'rm -rf "$profile_dir"' EXIT HUP INT TERM

if ! command -v firefox >/dev/null 2>&1; then
  echo "Firefox is required to render the social image." >&2
  exit 1
fi

firefox --headless --no-remote --profile "$profile_dir" \
  --window-size 1200,630 \
  --screenshot "$profile_dir/social-shot.png" \
  "file://$root_dir/social/social-shot.html"

test -s "$profile_dir/social-shot.png"
mv "$profile_dir/social-shot.png" "$root_dir/public/social-shot.png"
echo "Rendered public/social-shot.png"
