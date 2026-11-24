/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qoqrd85a",
    "name": "exercise",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "s4f0lpy3ibkgfqp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  // remove
  collection.schema.removeField("qoqrd85a")

  return dao.saveCollection(collection)
})
