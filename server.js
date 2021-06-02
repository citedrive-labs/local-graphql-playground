const express = require("express");
const database = require("./db.js");
const insertToDatabase = require('./insert.js')
const ExpressGraphQL = require("express-graphql");
const schema = require("./schema.js");
const cors = require("cors");
const local = express();


local.use(cors());
local.use(
  "/graphql",
  ExpressGraphQL({ schema: schema.schema, graphiql: true })
);

local.listen(4000, () => {
  console.log("Local GraphQL server: 🏃 at http://localhost:4000/graphql");
});
