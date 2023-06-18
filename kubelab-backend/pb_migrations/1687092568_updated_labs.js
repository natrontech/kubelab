migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
})
