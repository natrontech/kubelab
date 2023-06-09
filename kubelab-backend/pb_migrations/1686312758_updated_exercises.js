migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fqnmihgd",
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
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  // remove
  collection.schema.removeField("fqnmihgd")

  return dao.saveCollection(collection)
})
