migrate(
    (app) => {
        const collection = new Collection({
            id: "twr8eflpoom78k9",
            name: "plans",
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
                    id: "jhgt65nx",
                    name: "name",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "mbuxpqro",
                    name: "description",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "qe5g2utb",
                    name: "price",
                    type: "number",
                    required: false,
                    min: null,
                    max: null,
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
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        return app.delete(collection);
    },
);
