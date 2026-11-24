migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  // remove
  collection.schema.removeField("uao3gxwr")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uao3gxwr",
    "name": "agentRunning",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
