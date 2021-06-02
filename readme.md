# CiteDrive local-graphql-playground

yarn install

yarn start

http://localhost:4000/graphql

## Test Calls



```

{
  Reference {
    guid
    subtype
    notes
  } Ref(id: "7b26ce94-ad8b-482b-8088-239af5c7902a") {

    notes
    subtype
  }
  Reference {
    guid
  }
}

```

## Submit to Reference Table

```
mutation {
  createReference(guid: "test_guid_1", subtype:"Vlog",notes:"....") {
    guid,
    subtype,
    notes
  }
}
```

```
mutation {
  createReference(guid: "test_guid_2", subtype:"Hamburger",notes:"doasjpdk aodsak opdask opasd kopsa") {
    guid,
    subtype,
    notes
  }
}
```

```
mutation {
  createReference(guid: "test_guid_3", subtype:"Pizza",notes:"gfdgdf aodsak opdask opasd kopsa") {
    guid,
    subtype,
    notes
  }
}
```


## Update Reference |
```
mutation {
updateReference(
  guid: "7b26ce94-ad8b-482b-8088-239af5c7902a",
  subtype:"update subtype",
  notes:"update notes"
)
```
## delete Reference
```
mutation {
  deleteReference(id:"7b26ce94-ad8b-482b-8088-239af5c7902a")
}
```


https://citedrive.com/