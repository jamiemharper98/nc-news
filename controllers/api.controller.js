const { selectApi } = require("../models/api.model");
const fs = require("fs/promises");
const path = require("path");

exports.getApi = (req, res, next) => {
  selectApi().then((endpoints) => {
    const htmlPath = path.join(__dirname, "../views/apiDocs/index.html");
    let htmlString = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link type="text/css" rel="stylesheet" href="styles/api.style.css" />
        <title>news API docs</title>
      </head>
      <body>
        <header>
          <h1>Documentation for news API</h1>
        </header>
        <main class="content" id="api-content">
          <h2 id="subheader">This page contains all of the avaliable endpoints on this API</h2>`;
    for (const key in endpoints) {
      if (key !== "GET /api") {
        htmlString += `
          <div class="api-content">
          <h3>${key}</h3>
          <dl>
            <dt>Description</dt>
            <dd>- ${endpoints[key].description}</dd>
            <dt>Queries</dt>
            <dd>- ${JSON.stringify(endpoints[key].queries)}</dd>
            <dt>Example Response</dt>
            <dd>- ${JSON.stringify(endpoints[key].exampleResponse)}</dd>
          </dl>
        </div>`;
      }
    }
    // document.getElementById("api-content").insertAdjacentHTML("beforeend", htmlString);
    htmlString += `    
    </main>
    </body>
  </html>`;
    fs.writeFile(htmlPath, htmlString, "utf-8").then(() => res.status(200).sendFile(htmlPath)); //.send({ endpoints });
  });
};
