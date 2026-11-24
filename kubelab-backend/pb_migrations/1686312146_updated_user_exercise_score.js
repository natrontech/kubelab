migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        collection.viewQuery =
            "SELECT COALESCE(NULLIF(exercise_sessions.user, ''), 'score0000000000') as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;";

        // remove
        collection.fields.removeById("swlqrmos");

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "dvvwd0w4",
                name: "sum",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        collection.viewQuery =
            "SELECT printf('%015d', ROW_NUMBER() OVER()) as id, COUNT(exercise_sessions.id) as sum\nFROM exercise_sessions WHERE exercise_sessions.endTime NOTNULL;";

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "swlqrmos",
                name: "sum",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        // remove
        collection.fields.removeById("dvvwd0w4");

        return app.save(collection);
    },
);
