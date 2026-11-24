/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("w8voaruazjzwfdy");

        collection.listRule = "";
        collection.viewRule = "";

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("w8voaruazjzwfdy");

        collection.listRule = null;
        collection.viewRule = null;

        return app.save(collection);
    },
);
