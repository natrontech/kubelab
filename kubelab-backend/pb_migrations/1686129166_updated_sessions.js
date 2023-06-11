migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l3csgcmv",
    "name": "lab",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "a1s1vqlm7141lcr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "title"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l3csgcmv",
    "name": "lab",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "a1s1vqlm7141lcr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "title"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
