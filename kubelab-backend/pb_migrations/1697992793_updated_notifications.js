/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("r2q6rrbyred18kq");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "qoqrd85a",
                name: "exercise",
                type: "relation",
                required: false,
                presentable: false,
                collectionId: "s4f0lpy3ibkgfqp",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("r2q6rrbyred18kq");

        // remove
        collection.fields.removeById("qoqrd85a");

        return app.save(collection);
    },
);
