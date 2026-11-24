migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        // remove
        collection.fields.removeById("uao3gxwr");

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        // add
        collection.fields.add(
            new BoolField({
                system: false,
                id: "uao3gxwr",
                name: "agentRunning",
                type: "bool",
                required: false,
            }),
        );

        return app.save(collection);
    },
);
