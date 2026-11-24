migrate(
    (app) => {
        const collection = new Collection({
            id: "3fhw2mfr9zrgodj",
            name: "hooks",
            type: "base",
            system: false,
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    system: false,
                    id: "j8mewfur",
                    name: "collection",
                    type: "text",
                    required: true,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "4xcxcfuv",
                    name: "event",
                    type: "select",
                    required: true,
                    maxSelect: 1,
                    values: ["insert", "update", "delete"],
                },
                {
                    system: false,
                    id: "u3bmgjpb",
                    name: "action_type",
                    type: "select",
                    required: true,
                    maxSelect: 1,
                    values: ["command", "post"],
                },
                {
                    system: false,
                    id: "kayyu1l3",
                    name: "action",
                    type: "text",
                    required: true,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "zkengev8",
                    name: "action_params",
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
        const collection = app.findCollectionByNameOrId("3fhw2mfr9zrgodj");

        return app.delete(collection);
    },
);
