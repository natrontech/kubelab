migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  // remove
  collection.schema.removeField("pnavjyzl")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pnavjyzl",
    "name": "exercises",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "s4f0lpy3ibkgfqp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "title"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
