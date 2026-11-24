/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.listRule =
            '@request.auth.id = user.id || @request.auth.role = "admin"';
        collection.viewRule =
            '@request.auth.id = user.id || @request.auth.role = "admin"';

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        collection.listRule = "@request.auth.id = user.id ";
        collection.viewRule = "@request.auth.id = user.id ";

        return app.save(collection);
    },
);
