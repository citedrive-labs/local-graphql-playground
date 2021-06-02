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

// Create Reference Table
knex.schema
  .hasTable("reference")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("reference", (table) => {
          table.string("guid").primary();
          table.string("title");
          table.string("date_accessed");
          table.string("date_published");
          table.string("extra"); // ??
          table.json("json"); // csl_json
          table.json("bibtex"); // bibtex_json SLUG TODO: remove bibtex
          table.string("subtype");
          table.string("notes");
          table.string("project_id").unsigned(); // Foreign Key
          table.foreign("project_id").references("project.uuid");
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

// Create User_Table

// Create Context Table
knex.schema
  .hasTable("context")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("context", (table) => {
          table.string("id").primary();
          table.string("user_id");
          table.string("user_password");
          table.string("user_email");
          table.string("auth_token");
          table.boolean("dark_mode");
          table.json("open_folders");
          table.string("server_url");
          table.string("project_id");
          table.date("last_sync");
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

// Create referenceHasTags Table

/*
knex.schema.hasTable('referenceHasTags')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('referenceHasTags', (table)  => {
          table.string('reference_id').unsigned()
          table.string('tag').unsigned()
          table.foreign('reference_id').references('reference.guid')
          table.foreign('tag').references('tags.name')
          table.primary(['reference_id', 'tag']);
        })
        .catch((error) => {
          console.error(`Set up : ${error}`)
        })
      }
    })
    .catch((error) => {
      console.error(`Setup Database: ${error}`)
    })
*/

/*
  // Create referenceHasAuthor Table
  knex.schema.hasTable('referenceHasAuthor')
      .then((exists) => {
        if (!exists) {
          return knex.schema.createTable('referenceHasAuthor', (table)  => {
            table.string('reference_id').unsigned()
            table.string('author_id').unsigned()
            table.foreign('reference_id').references('reference.guid')
            table.foreign('author_id').references('author.guid')
            table.primary(['reference_id', 'author_id']);
          })
          .catch((error) => {
            console.error(`Set up : ${error}`)
          })
        }
      })
      .catch((error) => {
        console.error(`Setup Database: ${error}`)
      })


      // Create author Table
      knex.schema.hasTable('author')
          .then((exists) => {
            if (!exists) {
              return knex.schema.createTable('author', (table)  => {
                table.string('guid').primary()
                table.string('firstname')
                table.string('lastname')
                table.string('role')
              })
              .catch((error) => {
                console.error(`Set up : ${error}`)
              })
            }
          })
          .catch((error) => {
            console.error(`Setup Database: ${error}`)
          })

          */
// Create referenceHasCitation Table

/*
  knex.schema.hasTable('referenceHasCitation')
      .then((exists) => {
        if (!exists) {
          return knex.schema.createTable('referenceHasCitation', (table)  => {
            table.string('reference_id').unsigned()
            table.string('citation_id').unsigned()
            table.foreign('reference_id').references('reference.guid')
            table.foreign('citation_id').references('citation.guid')
            table.primary(['reference_id', 'citation_id']);
          })
          .catch((error) => {
            console.error(`Set up : ${error}`)
          })
        }
      })
      .catch((error) => {
        console.error(`Setup Database: ${error}`)
      })
*/

// Create referencePartOfGroup Table
knex.schema
  .hasTable("referencePartOfGroup")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("referencePartOfGroup", (table) => {
          table.string("reference_id").unsigned();
          table.string("group_id").unsigned();
          table
            .foreign("reference_id")
            .references("reference.guid")
            .onDelete("CASCADE");
          table
            .foreign("group_id")
            .references("ref_group.guid")
            .onDelete("CASCADE");
          table.primary(["reference_id", "group_id"]);
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

// Create comment Table
knex.schema
  .hasTable("comment")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("comment", (table) => {
          table.string("guid").primary();
          table.date("date");
          table.string("reference_id").unsigned(); // FOreign Key
          table.string("username").unsigned(); // Foreign Key
          table.foreign("reference_id").references("reference.guid");
          table.foreign("username").references("user.username");
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

// Create citation Table
knex.schema
  .hasTable("citation")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("citation", (table) => {
          table.string("guid").primary();
          table.string("prefix");
          table.string("suffix");
          table.boolean("author-only");
          table.string("label"); // e.g. page
          table.string("locator"); // e.g. 32 --> page 32
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

// Create user Table
knex.schema
  .hasTable("user")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("user", (table) => {
          table.string("username").primary();
          table.string("password"); // for testing: hash?
          table.string("email");
        })
        .catch((error) => {
          console.error(`Set up : ${error}`);
        });
    }
  })
  .catch((error) => {
    console.error(`Setup Database: ${error}`);
  });

knex.schema
  .hasTable("ref_group")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("ref_group", (table) => {
          table.string("guid").primary();
          table.string("name");
          table.string("type"); // folder, ref_list, math_list
          table.string("parent").unsigned();
          table
            .foreign("parent")
            .references("guid")
            .inTable("ref_group")
            .onDelete("CASCADE");
          table.string("project_id").unsigned(); // FOreign Key
          table.foreign("project_id").references("project.uuid");
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
