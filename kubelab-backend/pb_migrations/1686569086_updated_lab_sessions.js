migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.viewRule = "@request.auth.id = user.id ";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.viewRule = null;

        return app.save(collection);
    },
);
