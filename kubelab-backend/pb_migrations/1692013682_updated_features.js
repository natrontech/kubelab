/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vknl4jpc8e5wlbv")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vknl4jpc8e5wlbv")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
