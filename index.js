const server = require("./api/server");

const port = process.env.PORT || 5001;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
