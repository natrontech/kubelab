/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.viewRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.createRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("juzwmxmth0oqv89")

  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
