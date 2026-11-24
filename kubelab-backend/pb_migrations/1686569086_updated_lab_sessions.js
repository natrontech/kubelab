migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.viewRule = "@request.auth.id = user.id "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
