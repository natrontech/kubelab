migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.listRule = "@request.auth.id = user.id ";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.listRule = null;

        return app.save(collection);
    },
);
