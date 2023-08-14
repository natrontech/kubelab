migrate((db) => {
  const collection = new Collection({
    "id": "vknl4jpc8e5wlbv",
    "created": "2023-08-14 09:16:18.702Z",
    "updated": "2023-08-14 09:16:18.702Z",
    "name": "features",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0zkeyduh",
        "name": "feature",
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
  const collection = dao.findCollectionByNameOrId("vknl4jpc8e5wlbv");

  return dao.deleteCollection(collection);
})
