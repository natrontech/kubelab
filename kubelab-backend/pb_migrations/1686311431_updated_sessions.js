migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.name = "lab_sessions"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n7tne53bbobf2bt")

  collection.name = "sessions"

  return dao.saveCollection(collection)
})
