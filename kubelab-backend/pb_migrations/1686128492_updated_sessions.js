migrate(
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

        // add
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

        // add
        collection.fields.add(
            new DateField({
                system: false,
                id: "mapevfhq",
                name: "endTime",
                type: "date",
                required: false,
                min: "",
                max: "",
            }),
        );

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "l3csgcmv",
                name: "lab",
                type: "relation",
                required: false,
                collectionId: "a1s1vqlm7141lcr",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // remove
        collection.fields.removeById("ituarijg");

        // remove
        collection.fields.removeById("thwhdlu1");

        // remove
        collection.fields.removeById("mapevfhq");

        // remove
        collection.fields.removeById("l3csgcmv");

        return app.save(collection);
    },
);
