migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        collection.createRule = "";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        collection.createRule = null;

        return app.save(collection);
    },
);
