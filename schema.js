const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db_Path = path.resolve(__dirname, "db/example.sqlite");
const database = new sqlite3.Database(db_Path);
const graphql = require("graphql");
const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");


database.run("PRAGMA foreign_keys=ON");




let ExampleType = new graphql.GraphQLObjectType({
  name: "Table",
  fields: {
    uuid: { type: graphql.GraphQLString },
    label: { type: graphql.GraphQLString },
  },
});


let queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    Table: {
      type: graphql.GraphQLList(ExampleType), // RefType
      resolve: (root, args, context, info) => {
        return new Promise((resolve, reject) => {
          database.all("SELECT * FROM project", function (err, rows) {
            if (err) {
              reject([]);
            }
            resolve(GraphQLJSON.parseValue(rows));
          });
        });
      },
    },

    

    search: {
      type: graphql.GraphQLList(ExampleType),
      args: {
        search: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { search, project_id }, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT json, guid, json_extract(reference.bibtex, '$.title') as title,  json_extract(reference.bibtex, '$.year') as year, json_extract(reference.bibtex, '$.journal') as journal, json_extract(reference.bibtex, '$.author') as author, json_extract(reference.bibtex, '$.editor') as editor, json_extract(reference.bibtex, '$.type') as type, bibtex FROM reference WHERE (json_extract(reference.bibtex, '$.title')  LIKE (?) OR json_extract(reference.bibtex, '$.author')  LIKE (?)) AND project_id = (?);",
            ["%" + search + "%", "%" + search + "%", project_id],
            function (err, rows) {
              if (err) {
                reject([]);
              }
              resolve(rows);
            }
          );
        });
      },
    },




  },
});

var mutationRefType = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {

    createProject: {
      type: ExampleType,
      args: {
        uuid: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        label: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { uuid, label }) => {
        return new Promise((resolve, reject) => {
          //raw SQLite to insert a new post in post table
          database.run(
            "INSERT INTO project (uuid, label) VALUES (?,?);",
            [uuid, label],
            (err) => {
              if (err) {
                reject(null);
              }
              database.get("SELECT last_insert_rowid() as id", (err, row) => {
                resolve({
                  //id: row["id"],
                  uuid: uuid,
                  label: label,
                });
              });
            }
          );
        });
      },
    },


    deleteReference: {
      type: graphql.GraphQLString,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { id }) => {
        return new Promise((resolve, reject) => {
          database.run(
            "DELETE from Reference WHERE guid =(?);",
            [id],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`Reference #${id} deleted`);
            }
          );
        });
      },
    },

  },
});
/**/

const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationRefType,
});

module.exports = {
  schema,
};
