migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "iousqpjz",
                name: "user",
                type: "relation",
                required: true,
                collectionId: "_pb_users_auth_",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        // add
        collection.fields.add(
            new DateField({
                system: false,
                id: "g8s5seza",
                name: "startTime",
                type: "date",
                required: true,
                min: "",
                max: "",
            }),
        );

        // add
        collection.fields.add(
            new DateField({
                system: false,
                id: "a3yguusb",
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
                id: "9oftn8f7",
                name: "exercise",
                type: "relation",
                required: true,
                collectionId: "s4f0lpy3ibkgfqp",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        // remove
        collection.fields.removeById("iousqpjz");

        // remove
        collection.fields.removeById("g8s5seza");

        // remove
        collection.fields.removeById("a3yguusb");

        // remove
        collection.fields.removeById("9oftn8f7");

        return app.save(collection);
    },
);
