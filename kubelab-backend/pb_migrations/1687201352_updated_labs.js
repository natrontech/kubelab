migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1s1vqlm7141lcr")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
})
