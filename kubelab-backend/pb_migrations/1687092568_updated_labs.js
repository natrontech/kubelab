migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        collection.listRule = null;
        collection.viewRule = null;

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        collection.listRule = "";
        collection.viewRule = "";

        return app.save(collection);
    },
);
