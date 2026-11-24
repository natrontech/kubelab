migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "fqnmihgd",
                name: "lab",
                type: "relation",
                required: true,
                collectionId: "a1s1vqlm7141lcr",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        // remove
        collection.fields.removeById("fqnmihgd");

        return app.save(collection);
    },
);
