migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        collection.listRule = "@request.auth.id != user.id";
        collection.viewRule = "@request.auth.id != user.id";
        collection.createRule = "@request.auth.id != user.id";
        collection.updateRule = "@request.auth.id != user.id";
        collection.deleteRule = "@request.auth.id != user.id";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        collection.listRule = null;
        collection.viewRule = null;
        collection.createRule = null;
        collection.updateRule = null;
        collection.deleteRule = null;

        return app.save(collection);
    },
);
