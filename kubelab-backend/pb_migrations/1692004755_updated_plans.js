migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // update
        collection.fields.add(
            new NumberField({
                system: false,
                id: "qe5g2utb",
                name: "price",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // update
        collection.fields.add(
            new NumberField({
                system: false,
                id: "qe5g2utb",
                name: "price",
                type: "number",
                required: true,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
);
