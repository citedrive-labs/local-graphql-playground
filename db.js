const path = require("path");
const library = path.resolve(__dirname, "db/project.sqlite");
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: library,
  },
  useNullAsDefault: true,
});

// Create Project_Table

knex.schema
  .hasTable("project")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("project", (table) => {
          table.string("uuid").primary();
          table.string("label");
          table.string("type");
          table.string("urlLocal");
          table.string("urlCloud");
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
