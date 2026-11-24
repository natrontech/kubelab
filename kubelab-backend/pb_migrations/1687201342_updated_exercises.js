migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4f0lpy3ibkgfqp")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
