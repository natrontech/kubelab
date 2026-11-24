/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // add
        collection.fields.add(
            new SelectField({
                system: false,
                id: "tep58ydu",
                name: "role",
                type: "select",
                required: false,
                presentable: false,
                maxSelect: 1,
                values: ["user", "admin"],
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // remove
        collection.fields.removeById("tep58ydu");

        return app.save(collection);
    },
);
