/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "jibt2vep48ufd22",
    "created": "2023-08-14 16:07:31.811Z",
    "updated": "2023-08-14 16:07:31.811Z",
    "name": "faqs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "e9bldrjo",
        "name": "question",
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
        "id": "qrlumdkc",
        "name": "answer",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("jibt2vep48ufd22");

  return dao.deleteCollection(collection);
})
