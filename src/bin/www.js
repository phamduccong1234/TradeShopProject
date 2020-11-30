const http = require("http");
const app = require("../boostrap/app");
const appConfig = require("../config/default");

// const config = require("config");

// const port = config.get("app.PORT");
const port = appConfig.app.PORT;
console.log("port", port)

const server = http.createServer(app);

server.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});

require("../boostrap/chat")(server)
