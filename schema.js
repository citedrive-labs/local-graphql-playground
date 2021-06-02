const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const db_Path = path.resolve(__dirname, "db/project.sqlite");
const database = new sqlite3.Database(db_Path);

const graphql = require("graphql");
const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");
const { ObjectType, Field } = require("type-graphql"); // Remove

database.run("PRAGMA foreign_keys=ON");

const defaultType = new graphql.GraphQLObjectType({
  name: "MyType",

  fields: {
    json: { type: GraphQLJSON },
    // json: { type: GraphQLJSONObject }
  },
});

let RefType = new graphql.GraphQLObjectType({
  name: "Ref",
  fields: {
    guid: { type: graphql.GraphQLString },
    title: { type: graphql.GraphQLString },
    type: { type: graphql.GraphQLString },
    year: { type: graphql.GraphQLString },
    journal: { type: graphql.GraphQLString },
    author: { type: GraphQLJSON },
    editor: { type: GraphQLJSON },
    json: { type: GraphQLJSON },
    bibtex: { type: GraphQLJSON },
  },
});

let ContextType = new graphql.GraphQLObjectType({
  name: "Context",
  fields: {
    id: { type: graphql.GraphQLString },
    user_id: { type: graphql.GraphQLString },
    user_password: { type: graphql.GraphQLString },
    user_email: { type: graphql.GraphQLString },
    auth_token: { type: graphql.GraphQLString },
    dark_mode: { type: graphql.GraphQLString },
    open_folders: { type: graphql.GraphQLString },
    server_url: { type: graphql.GraphQLString },
    project_id: { type: graphql.GraphQLString },
    last_sync: { type: graphql.GraphQLString },
  },
});

let ProjectType = new graphql.GraphQLObjectType({
  name: "Project",
  fields: {
    uuid: { type: graphql.GraphQLString },
    label: { type: graphql.GraphQLString },
    type: { type: graphql.GraphQLString },
  },
});

const GroupType = new graphql.GraphQLObjectType({
  name: "Group_ID",
  fields: {
    guid: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    type: { type: graphql.GraphQLString },
    parent: { type: graphql.GraphQLString },
  },
});

const GroupHasReferenceType = new graphql.GraphQLObjectType({
  name: "GHR_ID",
  fields: {
    guid: { type: graphql.GraphQLString },
    notes: { type: graphql.GraphQLString },
    subtype: { type: graphql.GraphQLString },
  },
});

const ReferencePartOfGroup = new graphql.GraphQLObjectType({
  name: "GHR_ID",
  fields: {
    reference_id: { type: graphql.GraphQLString },
    group_id: { type: graphql.GraphQLString },
  },
});

let queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    Project: {
      type: graphql.GraphQLList(ProjectType), // RefType
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

    userContext: {
      type: graphql.GraphQLList(ContextType), // RefType
      resolve: (root, args, context, info) => {
        return new Promise((resolve, reject) => {
          database.all("SELECT * FROM context WHERE id = 111", function (
            err,
            rows
          ) {
            if (err) {
              reject([]);
            }
            resolve(GraphQLJSON.parseValue(rows));
          });
        });
      },
    },

    Reference: {
      type: graphql.GraphQLList(RefType), // RefType
      args: {
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { project_id }, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT json, guid, json_extract(reference.bibtex, '$.title') as title,  json_extract(reference.bibtex, '$.year') as year, json_extract(reference.bibtex, '$.journal') as journal, json_extract(reference.bibtex, '$.author') as author, json_extract(reference.bibtex, '$.editor') as editor, json_extract(reference.bibtex, '$.type') as type, bibtex  FROM Reference WHERE project_id = (?)",
            [project_id],
            function (err, rows) {
              if (err) {
                reject([]);
              }
              resolve(GraphQLJSON.parseValue(rows));
            }
          );
        });
      },
    },

    ReferenceProjectContext: {
      type: graphql.GraphQLList(RefType), // RefType

      resolve: (root, args, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "Select reference.bibtex, reference.project_id from reference, context where context.project_id = reference.project_id",
            function (err, rows) {
              if (err) {
                reject([]);
              }
              resolve(GraphQLJSON.parseValue(rows));
            }
          );
        });
      },
    },

    // Ref by ID
    Ref: {
      type: RefType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { id, project_id }, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT json, guid, json_extract(reference.bibtex, '$.title') as title,  json_extract(reference.bibtex, '$.year') as year, json_extract(reference.bibtex, '$.journal') as journal, json_extract(reference.bibtex, '$.author') as author, json_extract(reference.bibtex, '$.editor') as editor, json_extract(reference.bibtex, '$.type') as type, bibtex  FROM Reference  WHERE reference.guid = (?) AND project_id = (?);",
            [id, project_id],
            function (err, rows) {
              if (err) {
                reject(null);
              }
              resolve(rows[0]);
            }
          );
        });
      },
    },

    searchRef: {
      type: graphql.GraphQLList(RefType),
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

    Group: {
      type: graphql.GraphQLList(GroupType),
      args: {
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { project_id }, context, info) => {
        return new Promise((resolve, reject) => {
          // raw SQLite query to select from table
          database.all(
            "select * from ref_group WHERE project_id = (?)",
            [project_id],
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

    Folder: {
      type: graphql.GraphQLList(GroupType),
      args: {
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { project_id }, context, info) => {
        return new Promise((resolve, reject) => {
          // raw SQLite query to select from table
          database.all(
            "SELECT * FROM ref_group WHERE type ='list' AND project_id = (?)",
            [project_id],
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

    GroupHasReference: {
      type: graphql.GraphQLList(RefType),
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        project_ID: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { id, project_ID }, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT json, guid, json_extract(reference.bibtex, '$.title') as title,  json_extract(reference.bibtex, '$.year') as year, json_extract(reference.bibtex, '$.journal') as journal, json_extract(reference.bibtex, '$.author') as author, json_extract(reference.bibtex, '$.editor') as editor, json_extract(reference.bibtex, '$.type') as type, bibtex FROM reference, referencePartOfGroup WHERE reference.guid = referencePartOfGroup.reference_id AND referencePartOfGroup.group_id = (?) AND reference.project_ID = (?)",
            [id, project_ID],
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
    createGroup: {
      type: GroupType,
      args: {
        guid: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        type: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        parent: {
          type: graphql.GraphQLString,
        },
        name: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        project_ID: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { guid, type, parent, name, project_ID }) => {
        return new Promise((resolve, reject) => {
          //raw SQLite to insert a new post in post table
          console.log(parent);
          if (parent !== null) {
            database.run(
              "INSERT INTO ref_group (guid, type, parent, name, project_id) VALUES (?,?,?,?,?);",
              [guid, type, parent, name, project_ID],
              (err) => {
                if (err) {
                  reject(null);
                }
                database.get("SELECT last_insert_rowid() as id", (err, row) => {
                  resolve({
                    //id: row["id"],
                    guid: guid,
                    type: type,
                    name: name,
                    parent: parent,
                  });
                });
              }
            );
          } else {
            database.run(
              "INSERT INTO ref_group (guid, type, parent, name) VALUES (?,?,?);",
              [guid, type, name],
              (err) => {
                if (err) {
                  reject(null);
                }
                database.get("SELECT last_insert_rowid() as id", (err, row) => {
                  resolve({
                    //id: row["id"],
                    guid: guid,
                    type: type,
                    name: name,
                  });
                });
              }
            );
          }
        });
      },
    },

    createReference: {
      type: RefType,
      args: {
        guid: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        bibtex: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        projectID: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { guid, bibtex, projectID }) => {
        return new Promise((resolve, reject) => {
          //raw SQLite to insert a new post in post table
          database.run(
            "INSERT INTO reference (guid, bibtex, project_id) VALUES (?,?,?);",
            [guid, bibtex, projectID],
            (err) => {
              if (err) {
                reject(null);
              }
              database.get("SELECT last_insert_rowid() as id", (err, row) => {
                resolve({
                  //id: row["id"],
                  guid: guid,
                  json: bibtex,
                });
              });
            }
          );
        });
      },
    },

    createProject: {
      type: ProjectType,
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

    addRefGroup: {
      type: ReferencePartOfGroup,
      args: {
        reference_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        group_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { reference_id, group_id }) => {
        return new Promise((resolve, reject) => {
          //raw SQLite to insert a new post in post table
          database.run(
            "INSERT INTO referencePartOfGroup (reference_id, group_id) VALUES (?,?);",
            [reference_id, group_id],
            (err) => {
              if (err) {
                reject(null);
              }
              database.get("SELECT last_insert_rowid() as id", (err, row) => {
                resolve({
                  //id: row["id"],
                  reference_id: reference_id,
                  group_id: group_id,
                });
              });
            }
          );
        });
      },
    },

    updateReference: {
      //type of object to return afater update in SQLite
      type: graphql.GraphQLString,
      //argument of mutation creactePost to get from request
      args: {
        guid: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        bibtex: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { bibtex, guid }) => {
        return new Promise((resolve, reject) => {
          database.run(
            "UPDATE Reference SET bibtex = (?) WHERE guid = (?);",
            [bibtex, guid],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`Reference #${guid} updated`);
            }
          );
        });
      },
    },

    createContext: {
      //type of object to return afater update in SQLite
      type: graphql.GraphQLString,
      //argument of mutation creactePost to get from request
      args: {
        user_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        user_password: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        user_email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        auth_token: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        dark_mode: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        open_folders: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        server_url: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        last_sync: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (
        root,
        {
          user_id,
          user_password,
          user_email,
          auth_token,
          dark_mode,
          open_folders,
          server_url,
          project_id,
          last_sync,
        }
      ) => {
        return new Promise((resolve, reject) => {
          database.run(
            'INSERT INTO Context (user_id, user_password, user_email, auth_token, dark_mode, open_folders, server_url, project_id, last_sync, id) VALUES (?,?,?,?,?,?,?,?,?,"111")',
            [
              user_id,
              user_password,
              user_email,
              auth_token,
              dark_mode,
              open_folders,
              server_url,
              project_id,
              last_sync,
            ],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`context  updated`);
            }
          );
        });
      },
    },

    updateContext: {
      //type of object to return afater update in SQLite
      type: graphql.GraphQLString,
      //argument of mutation creactePost to get from request
      args: {
        user_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        user_password: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        user_email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        auth_token: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        dark_mode: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        open_folders: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        server_url: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        last_sync: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (
        root,
        {
          user_id,
          user_password,
          user_email,
          auth_token,
          dark_mode,
          open_folders,
          server_url,
          project_id,
          last_sync,
        }
      ) => {
        return new Promise((resolve, reject) => {
          database.run(
            "UPDATE Context SET user_id = (?) , user_password = (?) , user_email = (?) , auth_token = (?) , dark_mode = (?) , open_folders = (?) , server_url = (?) , project_id = (?) , last_sync = (?) WHERE id = 111;",
            [
              user_id,
              user_password,
              user_email,
              auth_token,
              dark_mode,
              open_folders,
              server_url,
              project_id,
              last_sync,
            ],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`context  updated`);
            }
          );
        });
      },
    },

    updateProjectContext: {
      //type of object to return afater update in SQLite
      type: graphql.GraphQLString,
      //argument of mutation creactePost to get from request
      args: {
        project_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: (root, { project_id }) => {
        return new Promise((resolve, reject) => {
          database.run(
            "UPDATE Context SET  project_id = (?)  WHERE id = 111;",
            [project_id],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`context  updated`);
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

    deleteAll: {
      type: graphql.GraphQLString, // RefType
      resolve: (root, args) => {
        return new Promise((resolve, reject) => {
          database.run("DELETE FROM reference; ", (err) => {
            if (err) {
              reject(err);
            }
            resolve(`...`);
          });

          database.run("DELETE FROM ref_group; ", (err) => {
            if (err) {
              reject(err);
            }
            resolve(`...`);
          });

          database.run("DELETE FROM project; ", (err) => {
            if (err) {
              reject(err);
            }
            resolve(`...`);
          });

          database.run("DELETE FROM context; ", (err) => {
            if (err) {
              reject(err);
            }
            resolve(`...`);
          });
        });
      },
    },

    deleteGroup: {
      type: graphql.GraphQLString,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { id }) => {
        return new Promise((resolve, reject) => {
          database.run(
            "DELETE from ref_group WHERE guid =(?);",
            [id],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`ref_group WHERE #${id} deleted`);
            }
          );
        });
      },
    },

    removeFromGroup: {
      type: graphql.GraphQLString,
      args: {
        group_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        ref_id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { group_id, ref_id }) => {
        return new Promise((resolve, reject) => {
          database.run(
            "DELETE from referencePartOfGroup WHERE group_id =(?) and reference_id = (?);",
            [group_id, ref_id],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(`referencePartOfGroup WHERE #${group_id} deleted`);
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
