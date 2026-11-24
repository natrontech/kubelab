migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "thwhdlu1",
    "name": "startTime",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "thwhdlu1",
    "name": "startTime",
    "type": "date",
    "required": true,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
