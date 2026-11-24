/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.listRule =
            '@request.auth.id != "" && @request.auth.role = "admin"';

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.listRule = '@request.auth.id != ""';

        return app.save(collection);
    },
);
