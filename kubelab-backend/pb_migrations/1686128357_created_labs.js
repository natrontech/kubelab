migrate((db) => {
  const collection = new Collection({
    "id": "a1s1vqlm7141lcr",
    "created": "2023-06-07 08:59:17.658Z",
    "updated": "2023-06-07 08:59:17.658Z",
    "name": "labs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "00op3jnz",
        "name": "title",
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
        "id": "abvux9fb",
        "name": "description",
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
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr");

  return dao.deleteCollection(collection);
})
