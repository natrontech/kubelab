migrate(
    (app) => {
        const collection = new Collection({
            id: "vknl4jpc8e5wlbv",
            name: "features",
            type: "base",
            system: false,
            indexes: [],
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    system: false,
                    id: "0zkeyduh",
                    name: "feature",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
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
        const collection = app.findCollectionByNameOrId("vknl4jpc8e5wlbv");

        return app.delete(collection);
    },
);
