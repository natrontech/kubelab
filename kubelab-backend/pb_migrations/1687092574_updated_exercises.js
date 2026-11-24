migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        collection.listRule = null;
        collection.viewRule = null;

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        collection.listRule = "";
        collection.viewRule = "";

        return app.save(collection);
    },
);
