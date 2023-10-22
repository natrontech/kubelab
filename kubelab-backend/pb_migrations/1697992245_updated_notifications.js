/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r2q6rrbyred18kq")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
})
