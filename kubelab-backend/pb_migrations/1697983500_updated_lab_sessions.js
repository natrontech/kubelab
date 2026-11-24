/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.listRule = "@request.auth.id = user.id || @request.auth.role = \"admin\""
  collection.viewRule = "@request.auth.id = user.id || @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.listRule = "@request.auth.id = user.id "
  collection.viewRule = "@request.auth.id = user.id "

  return dao.saveCollection(collection)
})
