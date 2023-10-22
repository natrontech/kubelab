/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.listRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
