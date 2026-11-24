migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("n7tne53bbobf2bt");

        // remove
        collection.fields.removeById("6zraywm2");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "rse3zear",
                name: "user",
                type: "relation",
                required: true,
                collectionId: "_pb_users_auth_",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

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

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "rse3zear",
                name: "user",
                type: "relation",
                required: false,
                collectionId: "_pb_users_auth_",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

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
);
