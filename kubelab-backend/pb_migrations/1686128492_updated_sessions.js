migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ituarijg",
    "name": "title",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "thwhdlu1",
    "name": "startTime",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mapevfhq",
    "name": "endTime",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l3csgcmv",
    "name": "lab",
    "type": "relation",
    "required": false,
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
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  // remove
  collection.schema.removeField("ituarijg")

  // remove
  collection.schema.removeField("thwhdlu1")

  // remove
  collection.schema.removeField("mapevfhq")

  // remove
  collection.schema.removeField("l3csgcmv")

  return dao.saveCollection(collection)
})
