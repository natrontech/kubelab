/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.name = "exercise_session_logs"

  // remove
  collection.schema.removeField("c94ndl04")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "flngas50",
    "name": "exercise_session",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "qj6ssich32lcxru",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.name = "exercise_logs"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c94ndl04",
    "name": "exercise",
    "type": "relation",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "collectionId": "s4f0lpy3ibkgfqp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("flngas50")

  return dao.saveCollection(collection)
})
