/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "juzwmxmth0oqv89",
    "created": "2023-10-22 13:49:49.779Z",
    "updated": "2023-10-22 13:49:49.779Z",
    "name": "exercise_logs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qy80deun",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "c94ndl04",
        "name": "exercise",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "s4f0lpy3ibkgfqp",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "40uyszyy",
        "name": "timestamp",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89");

  return dao.deleteCollection(collection);
})
