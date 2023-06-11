migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19")

  collection.options = {
    "query": "SELECT lab_sessions.id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wmj3s2se",
    "name": "sum",
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
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19")

  collection.options = {
    "query": "SELECT lab_sessions.id\nFROM lab_sessions"
  }

  // remove
  collection.schema.removeField("wmj3s2se")

  return dao.saveCollection(collection)
})
