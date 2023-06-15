migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.listRule = "@request.auth.id = user.id "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.listRule = null

  return dao.saveCollection(collection)
})
