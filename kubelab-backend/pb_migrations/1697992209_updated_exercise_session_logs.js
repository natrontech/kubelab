/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.listRule = '@request.auth.id != ""';
        collection.viewRule = '@request.auth.id != ""';
        collection.createRule = '@request.auth.id != "" ';
        collection.updateRule = '@request.auth.id != ""';
        collection.deleteRule = '@request.auth.id != ""';

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.listRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';
        collection.viewRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';
        collection.createRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';
        collection.updateRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';
        collection.deleteRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';

        return app.save(collection);
    },
);
