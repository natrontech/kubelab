migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        collection.createRule = "";
        collection.updateRule = "";
        collection.deleteRule = "";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        collection.createRule = null;
        collection.updateRule = null;
        collection.deleteRule = null;

        return app.save(collection);
    },
);
