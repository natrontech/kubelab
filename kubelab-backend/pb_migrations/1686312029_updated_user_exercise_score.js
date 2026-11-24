migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        collection.viewQuery =
            "SELECT printf('%015d', ROW_NUMBER() OVER()) as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions";

        // remove
        collection.fields.removeById("wmj3s2se");

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "jgwml4ai",
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
            "SELECT COALESCE(lab_sessions.id, 'score0000000000') as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions";

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "wmj3s2se",
                name: "sum",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        // remove
        collection.fields.removeById("jgwml4ai");

        return app.save(collection);
    },
);
