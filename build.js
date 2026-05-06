name: Debug RSS Build

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download RSS + debug
        run: |
          echo "DOWNLOADING FEED..."
          curl -L https://www.lostinberlin.com/feed/ -o feed.xml

          echo "FILE SIZE:"
          wc -c feed.xml

          echo "FIRST 30 LINES:"
          head -n 30 feed.xml

      - name: Build HTML (safe minimal)
        run: |
          echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LostInBerlin</title></head><body><h1>LostInBerlin</h1><ul>' > index.html

          echo "<li>DEBUG MODE - check Actions logs</li>" >> index.html

          echo '</ul></body></html>' >> index.html

      - name: Commit result
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git add index.html feed.xml
          git commit -m "debug feed" || exit 0
          git push
