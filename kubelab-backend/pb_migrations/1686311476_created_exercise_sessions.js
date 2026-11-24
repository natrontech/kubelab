migrate(
    (app) => {
        const collection = new Collection({
            id: "qj6ssich32lcxru",
            name: "exercise_sessions",
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
                    id: "nc43tbmx",
                    name: "agentRunning",
                    type: "bool",
                    required: false,
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
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        return app.delete(collection);
    },
);
