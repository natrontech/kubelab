/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "arqpjvok",
                name: "company",
                type: "relation",
                required: false,
                presentable: true,
                collectionId: "w8voaruazjzwfdy",
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
        collection.fields.removeById("arqpjvok");

        return app.save(collection);
    },
);
