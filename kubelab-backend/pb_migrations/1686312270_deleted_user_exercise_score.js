migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        return app.delete(collection);
    },
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
            fields: [
                {
                    system: false,
                    id: "dvvwd0w4",
                    name: "sum",
                    type: "number",
                    required: false,
                    min: null,
                    max: null,
                },
            ],
            viewQuery:
                "SELECT COALESCE(NULLIF(exercise_sessions.user, ''), 'score0000000000') as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;",
        });

        return app.save(collection);
    },
);
