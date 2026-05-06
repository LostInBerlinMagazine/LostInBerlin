const https = require("https");
const fs = require("fs");

https.get("https://www.lostinberlin.com/feed/", (res) => {
  let data = "";

  res.on("data", chunk => data += chunk);

  res.on("end", () => {
    const items = [...data.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LostInBerlin Feed</title>
</head>
<body>
<h1>LostInBerlin</h1>
<ul>
`;

    for (const item of items) {
      const block = item[1];

      const title = (block.match(/<title>(.*?)<\/title>/) || [])[1];
      const link = (block.match(/<link>(.*?)<\/link>/) || [])[1];
      const img = (block.match(/<image:loc>(.*?)<\/image:loc>/) || [])[1];

      html += `<li>
        ${img ? `<img src="${img}" width="120"><br>` : ""}
        <a href="${link}" target="_blank">${title}</a>
      </li>`;
    }

    html += "</ul></body></html>";

    fs.writeFileSync("index.html", html);
    console.log("done");
  });

}).on("error", console.error);
