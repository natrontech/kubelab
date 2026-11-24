migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // update
        collection.fields.add(
            new DateField({
                system: false,
                id: "thwhdlu1",
                name: "startTime",
                type: "date",
                required: false,
                min: "",
                max: "",
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // update
        collection.fields.add(
            new DateField({
                system: false,
                id: "thwhdlu1",
                name: "startTime",
                type: "date",
                required: true,
                min: "",
                max: "",
            }),
        );

        return app.save(collection);
    },
);
