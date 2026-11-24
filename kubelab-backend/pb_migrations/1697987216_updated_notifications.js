/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
