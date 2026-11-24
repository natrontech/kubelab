migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        collection.createRule = "";
        collection.updateRule = "";
        collection.deleteRule = "";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        collection.createRule = null;
        collection.updateRule = null;
        collection.deleteRule = null;

        return app.save(collection);
    },
);
