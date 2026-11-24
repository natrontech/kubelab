migrate((db) => {
  const collection = new Collection({
    "id": "qj6ssich32lcxru",
    "created": "2023-06-09 11:51:16.171Z",
    "updated": "2023-06-09 11:51:16.171Z",
    "name": "exercise_sessions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nc43tbmx",
        "name": "agentRunning",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("qj6ssich32lcxru");

  return dao.deleteCollection(collection);
})
