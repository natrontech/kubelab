migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6zraywm2",
    "name": "score",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tr8kf1qh",
    "name": "clusterRunning",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // remove
  collection.schema.removeField("6zraywm2")

  // remove
  collection.schema.removeField("tr8kf1qh")

  return dao.saveCollection(collection)
})
