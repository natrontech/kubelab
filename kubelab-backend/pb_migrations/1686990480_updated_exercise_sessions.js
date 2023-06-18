migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qj6ssich32lcxru")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g8s5seza",
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
  const collection = dao.findCollectionByNameOrId("qj6ssich32lcxru")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g8s5seza",
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
