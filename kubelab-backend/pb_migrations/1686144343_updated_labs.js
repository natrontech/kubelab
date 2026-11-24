migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        // add
        collection.fields.add(
            new URLField({
                system: false,
                id: "qe7ybzdk",
                name: "docs",
                type: "url",
                required: false,
                exceptDomains: null,
                onlyDomains: null,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        // remove
        collection.fields.removeById("qe7ybzdk");

        return app.save(collection);
    },
);
