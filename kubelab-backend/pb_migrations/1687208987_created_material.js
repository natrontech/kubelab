migrate((db) => {
  const collection = new Collection({
    "id": "19zg2e2qeca2b7d",
    "created": "2023-06-19 21:09:47.996Z",
    "updated": "2023-06-19 21:09:47.996Z",
    "name": "material",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bql7kw5k",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "tkpuopqe",
        "name": "file",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("19zg2e2qeca2b7d");

  return dao.deleteCollection(collection);
})
