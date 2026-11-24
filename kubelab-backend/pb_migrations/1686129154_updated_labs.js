migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "pnavjyzl",
                name: "exercises",
                type: "relation",
                required: true,
                collectionId: "s4f0lpy3ibkgfqp",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 2147483647,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        // remove
        collection.fields.removeById("pnavjyzl");

        return app.save(collection);
    },
);
