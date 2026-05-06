name: Build RSS Feed Page

on:
  schedule:
    - cron: "0 * * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          persist-credentials: true

      - name: Build index.html
        run: |
          curl -s https://www.lostinberlin.com/feed/ > feed.xml

          echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LostInBerlin</title></head><body><h1>LostInBerlin</h1><ul>' > index.html

          grep -oP '(?s)<item>.*?</item>' feed.xml | while read item; do
            title=$(echo "$item" | grep -oP '(?<=<title>).*?(?=</title>)')
            link=$(echo "$item" | grep -oP '(?<=<link>).*?(?=</link>)')
            img=$(echo "$item" | grep -oP '(?<=<img[^>]*src=")[^"]+')

            echo "<li>" >> index.html
            if [ ! -z "$img" ]; then
              echo "<img src='$img' width='120'><br>" >> index.html
            fi
            echo "<a href='$link' target='_blank'>$title</a></li>" >> index.html
          done

          echo '</ul></body></html>' >> index.html

      - name: Commit and push
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "Yeah!"
          file_pattern: index.html
