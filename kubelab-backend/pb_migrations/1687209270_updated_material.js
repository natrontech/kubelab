migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("19zg2e2qeca2b7d");

        // update
        collection.fields.add(
            new FileField({
                system: false,
                id: "tkpuopqe",
                name: "file",
                type: "file",
                required: false,
                maxSelect: 1,
                maxSize: 10485760,
                mimeTypes: [],
                thumbs: [],
                protected: false,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("19zg2e2qeca2b7d");

        // update
        collection.fields.add(
            new FileField({
                system: false,
                id: "tkpuopqe",
                name: "file",
                type: "file",
                required: false,
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: [],
                thumbs: [],
                protected: false,
            }),
        );

        return app.save(collection);
    },
);
