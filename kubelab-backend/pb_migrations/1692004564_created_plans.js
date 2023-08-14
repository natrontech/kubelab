migrate((db) => {
  const collection = new Collection({
    "id": "twr8eflpoom78k9",
    "created": "2023-08-14 09:16:04.916Z",
    "updated": "2023-08-14 09:16:04.916Z",
    "name": "plans",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
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
  const collection = dao.findCollectionByNameOrId("twr8eflpoom78k9");

  return dao.deleteCollection(collection);
})
