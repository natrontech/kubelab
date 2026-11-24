migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        // update
        collection.fields.add(
            new DateField({
                system: false,
                id: "g8s5seza",
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
        const collection = app.findCollectionByNameOrId("qj6ssich32lcxru");

        // update
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

        return app.save(collection);
    },
);
