migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eldb7j7p",
    "name": "features",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vknl4jpc8e5wlbv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "feature"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srzysrtq",
    "name": "optionalFeatures",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "vknl4jpc8e5wlbv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "feature"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jhgt65nx",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mbuxpqro",
    "name": "description",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9")

  // remove
  collection.schema.removeField("eldb7j7p")

  // remove
  collection.schema.removeField("srzysrtq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jhgt65nx",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mbuxpqro",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

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
})
