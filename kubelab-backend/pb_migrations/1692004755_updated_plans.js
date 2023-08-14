migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qe5g2utb",
    "name": "price",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qe5g2utb",
    "name": "price",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
