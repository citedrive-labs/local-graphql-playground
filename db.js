const path = require("path");
const library = path.resolve(__dirname, "db/example.sqlite");
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: library,
  },
  useNullAsDefault: true,
});


knex.schema
  .hasTable("example")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("example", (table) => {
          table.string("uuid").primary();
          table.string("label");
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });


module.exports = knex;
