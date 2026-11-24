/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // remove
        collection.fields.removeById("1hbozave");

        // remove
        collection.fields.removeById("q6psj4sr");

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "1hbozave",
                name: "totalScore",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        // add
        collection.fields.add(
            new NumberField({
                system: false,
                id: "q6psj4sr",
                name: "avgMinutesToSolution",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
);
