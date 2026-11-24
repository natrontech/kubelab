migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("c0gc1ph97tdim19");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "c0gc1ph97tdim19",
    "created": "2023-06-09 11:58:47.771Z",
    "updated": "2023-06-09 12:02:26.128Z",
    "name": "user_exercise_score",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dvvwd0w4",
        "name": "sum",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT exercise_sessions.user as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;"
    }
  });

  return Dao(db).saveCollection(collection);
})
