migrate(
    (app) => {
        const collection = new Collection({
            id: "19zg2e2qeca2b7d",
            name: "material",
            type: "base",
            system: false,
            indexes: [],
            listRule: "",
            viewRule: "",
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    system: false,
                    id: "bql7kw5k",
                    name: "name",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
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
                },
                {
                    name: "created",
                    type: "autodate",
                    onCreate: true,
                },
                {
                    name: "updated",
                    type: "autodate",
                    onCreate: true,
                    onUpdate: true,
                },
            ],
        });

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("19zg2e2qeca2b7d");

        return app.delete(collection);
    },
);
