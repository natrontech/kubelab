migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qe7ybzdk",
    "name": "docs",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  // remove
  collection.schema.removeField("qe7ybzdk")

  return dao.saveCollection(collection)
})
