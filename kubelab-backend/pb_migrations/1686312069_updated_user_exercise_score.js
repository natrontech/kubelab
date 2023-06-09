migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19")

  collection.options = {
    "query": "SELECT (ROW_NUMBER() OVER()) as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions WHERE lab_sessions.endTime NOTNULL;"
  }

  // remove
  collection.schema.removeField("jgwml4ai")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4nfqwv0a",
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
    "query": "SELECT (ROW_NUMBER() OVER()) as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jgwml4ai",
    "name": "sum",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("4nfqwv0a")

  return dao.saveCollection(collection)
})
