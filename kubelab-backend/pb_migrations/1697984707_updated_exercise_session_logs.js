/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2pfxi0ho",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "start",
        "end"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2pfxi0ho",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "start",
        "end"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
