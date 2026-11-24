migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("3fhw2mfr9zrgodj");

        // add
        collection.fields.add(
            new TextField({
                system: false,
                id: "balsaeka",
                name: "expands",
                type: "text",
                required: false,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        // add
        collection.fields.add(
            new BoolField({
                system: false,
                id: "emgxgcok",
                name: "disabled",
                type: "bool",
                required: false,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("3fhw2mfr9zrgodj");

        // remove
        collection.fields.removeById("balsaeka");

        // remove
        collection.fields.removeById("emgxgcok");

        return app.save(collection);
    },
);
