name: Build RSS Feed Page

on:
  schedule:
    - cron: "0 * * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Build page from RSS
        run: |
          curl -s https://www.lostinberlin.com/feed/ > feed.xml

          echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LostInBerlin</title></head><body><h1>LostInBerlin</h1><ul>' > index.html

          awk -v RS="</item>" '
          /<item>/ {
            title=""
            link=""
            img=""

            if (match($0, /<title><!\[CDATA\[(.*?)\]\]><\/title>/, a)) title=a[1]
            else if (match($0, /<title>(.*?)<\/title>/, a)) title=a[1]

            if (match($0, /<link>(.*?)<\/link>/, a)) link=a[1]

            if (match($0, /<img[^>]+src="([^"]+)"/, a)) img=a[1]

            if (title != "" && link != "") {
              print "<li>"
              if (img != "") print "<img src=\"" img "\" width=\"120\"><br>"
              print "<a href=\"" link "\" target=\"_blank\">" title "</a></li>"
            }
          }' feed.xml >> index.html

          echo '</ul></body></html>' >> index.html

      - name: Commit
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add index.html
          git commit -m "update feed" || exit 0
          git push
