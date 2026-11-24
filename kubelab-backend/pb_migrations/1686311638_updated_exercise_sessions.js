migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qj6ssich32lcxru")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iousqpjz",
    "name": "user",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "email"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g8s5seza",
    "name": "startTime",
    "type": "date",
    "required": true,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a3yguusb",
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
    "id": "9oftn8f7",
    "name": "exercise",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "s4f0lpy3ibkgfqp",
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
  const collection = dao.findCollectionByNameOrId("qj6ssich32lcxru")

  // remove
  collection.schema.removeField("iousqpjz")

  // remove
  collection.schema.removeField("g8s5seza")

  // remove
  collection.schema.removeField("a3yguusb")

  // remove
  collection.schema.removeField("9oftn8f7")

  return dao.saveCollection(collection)
})
