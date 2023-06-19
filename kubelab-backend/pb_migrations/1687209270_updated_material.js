migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19zg2e2qeca2b7d")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tkpuopqe",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 10485760,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19zg2e2qeca2b7d")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tkpuopqe",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
