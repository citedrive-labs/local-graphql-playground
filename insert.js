const knex = require("./db");


knex("example")
  .insert([
    {
      uuid: "67f14b18-c3ba-11eb-8529-0242ac130003",
      label: "Lorem",
    },
    {
      uuid: "533r3qr-c3ba-11eb-8529-0242ac130003",
      label: "ipsum",
    },
    {
      uuid: "71e0a786-c3ba-11eb-8529-0242ac130003",
      label: "dolor",
    },
    
  ])
  .then(() => {
    // Send a success message in response
    console.log("tableinsert: done!");
  })
  .catch((err) => {
    // Send a error message in response
    console.log("error: insert(table)", err);
  });

