/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  // remove
  collection.schema.removeField("2pfxi0ho")

  return dao.saveCollection(collection)
})
