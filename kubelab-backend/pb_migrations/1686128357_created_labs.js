migrate(
    (app) => {
        const collection = new Collection({
            id: "a1s1vqlm7141lcr",
            name: "labs",
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
                    id: "00op3jnz",
                    name: "title",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "abvux9fb",
                    name: "description",
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
        const collection = app.findCollectionByNameOrId("a1s1vqlm7141lcr");

        return app.delete(collection);
    },
);
