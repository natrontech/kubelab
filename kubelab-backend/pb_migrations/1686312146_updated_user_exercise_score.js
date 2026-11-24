migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19")

  collection.options = {
    "query": "SELECT exercise_sessions.user as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;"
  }

  // remove
  collection.schema.removeField("swlqrmos")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dvvwd0w4",
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
    "query": "SELECT (ROW_NUMBER() OVER()) as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "swlqrmos",
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
  collection.schema.removeField("dvvwd0w4")

  return dao.saveCollection(collection)
})
