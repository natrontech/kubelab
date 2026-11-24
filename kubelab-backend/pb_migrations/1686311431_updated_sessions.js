migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.name = "lab_sessions";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.name = "sessions";

        return app.save(collection);
    },
);
