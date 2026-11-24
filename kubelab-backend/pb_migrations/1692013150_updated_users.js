/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "qrhpiuil",
                name: "plan",
                type: "relation",
                required: false,
                collectionId: "twr8eflpoom78k9",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // remove
        collection.fields.removeById("qrhpiuil");

        return app.save(collection);
    },
);
