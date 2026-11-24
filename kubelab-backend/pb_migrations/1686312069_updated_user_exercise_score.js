migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("c0gc1ph97tdim19");

        collection.viewQuery =
            "SELECT printf('%015d', ROW_NUMBER() OVER()) as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions WHERE lab_sessions.endTime NOTNULL;";

        // remove
        collection.fields.removeById("jgwml4ai");

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "4nfqwv0a",
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
            "SELECT printf('%015d', ROW_NUMBER() OVER()) as id, COUNT(lab_sessions.id) as sum\nFROM lab_sessions";

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

        // remove
        collection.fields.removeById("4nfqwv0a");

        return app.save(collection);
    },
);
