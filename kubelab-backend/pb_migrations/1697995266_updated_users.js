/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // add
        collection.fields.add(
            new BoolField({
                system: false,
                id: "3wxrrkpg",
                name: "workshop",
                type: "bool",
                required: false,
                presentable: true,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // remove
        collection.fields.removeById("3wxrrkpg");

        return app.save(collection);
    },
);
