/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eldb7j7p",
    "name": "features",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vknl4jpc8e5wlbv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "feature"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eldb7j7p",
    "name": "features",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vknl4jpc8e5wlbv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "feature"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
