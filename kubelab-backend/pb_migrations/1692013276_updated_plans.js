/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "eldb7j7p",
                name: "features",
                type: "relation",
                required: true,
                collectionId: "vknl4jpc8e5wlbv",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 2147483647,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "eldb7j7p",
                name: "features",
                type: "relation",
                required: true,
                collectionId: "vknl4jpc8e5wlbv",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
);
