migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.createRule = "@request.auth.id = user.id ";
        collection.updateRule = "@request.auth.id = user.id ";
        collection.deleteRule = "@request.auth.id = user.id ";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.createRule = null;
        collection.updateRule = null;
        collection.deleteRule = null;

        return app.save(collection);
    },
);
