migrate(
    (app) => {
        const collection = new Collection({
            id: "n7tne53bbobf2bt",
            name: "sessions",
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
                    id: "rse3zear",
                    name: "user",
                    type: "relation",
                    required: false,
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: false,
                    minSelect: null,
                    maxSelect: 1,
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
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        return app.delete(collection);
    },
);
