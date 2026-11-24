migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "l3csgcmv",
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
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "l3csgcmv",
                name: "lab",
                type: "relation",
                required: false,
                collectionId: "a1s1vqlm7141lcr",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
);
