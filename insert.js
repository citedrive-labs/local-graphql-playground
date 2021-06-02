const knex = require("./db");


knex("table")
  .insert([
    {
      uuid: "67f14b18-c3ba-11eb-8529-0242ac130003",
      label: "Lorem",
    },
    {
      uuid: "6d741c46-c3ba-11eb-8529-0242ac130003",
      label: "ipsum",
    },
    {
      uuid: "71e0a786-c3ba-11eb-8529-0242ac130003",
      label: "dolor",
    },
    
  ])
  .then(() => {
    // Send a success message in response
    console.log("ref_group insert: done!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(reference)", err);
  });

