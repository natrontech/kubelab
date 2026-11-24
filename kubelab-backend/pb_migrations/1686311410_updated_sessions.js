migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // remove
        collection.fields.removeById("ituarijg");

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // add
        collection.fields.add(
            new TextField({
                system: false,
                id: "ituarijg",
                name: "title",
                type: "text",
                required: false,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        return app.save(collection);
    },
);
