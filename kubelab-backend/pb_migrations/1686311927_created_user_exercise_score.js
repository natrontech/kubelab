migrate(
    (app) => {
        const collection = new Collection({
            id: "c0gc1ph97tdim19",
            name: "user_exercise_score",
            type: "view",
            system: false,
            indexes: [],
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [],
            viewQuery: "SELECT lab_sessions.id\nFROM lab_sessions",
        });

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        return app.delete(collection);
    },
);
