migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "6zraywm2",
                name: "score",
                type: "number",
                required: false,
                min: 0,
                max: null,
            }),
        );

        // add
        collection.fields.add(
            new BoolField({
                system: false,
                id: "tr8kf1qh",
                name: "clusterRunning",
                type: "bool",
                required: false,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // remove
        collection.fields.removeById("6zraywm2");

        // remove
        collection.fields.removeById("tr8kf1qh");

        return app.save(collection);
    },
);
