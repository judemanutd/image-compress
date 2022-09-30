const http = require("http");
const path = require("path");
const tinify = require("tinify");
const pLimit = require("p-limit");
const fs = require("fs");
const chalk = require("chalk");

tinify.key = "";

const hostname = "127.0.0.1";
const port = 3000;
const limit = pLimit(80); // batches of 80

const srcDirectory = path.join(__dirname, "/original");
const destDirectory = path.join(__dirname, "/compressed");

// Make an async function that gets executed immediately
(async () => {
  // Our starting point
  try {
    const files = await fs.promises.readdir(srcDirectory);
    const promises = files.map((file) => {
      const name = file;
      if (name) {
        return limit(async () => {
          const data = await fs.promises.readFile(`${srcDirectory}/${name}`);
          console.log("data", data);
          const fileData = await tinify.fromBuffer(data).toBuffer();
          await fs.promises.writeFile(`${destDirectory}/${name}`, fileData);
        });
      }
    });

    await Promise.allSettled(promises);

    console.log(chalk.blue("All DONE"), e);
  } catch (e) {
    console.error(chalk.red("We've thrown! Whoops!"), e);
  }
})();

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {});
