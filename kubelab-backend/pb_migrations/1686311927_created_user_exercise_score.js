migrate((db) => {
  const collection = new Collection({
    "id": "c0gc1ph97tdim19",
    "created": "2023-06-09 11:58:47.771Z",
    "updated": "2023-06-09 11:58:47.771Z",
    "name": "user_exercise_score",
    "type": "view",
    "system": false,
    "schema": [],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT lab_sessions.id\nFROM lab_sessions"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19");

  return dao.deleteCollection(collection);
})
