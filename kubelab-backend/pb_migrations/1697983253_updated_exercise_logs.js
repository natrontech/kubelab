/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.name = "exercise_session_logs";

        // remove
        collection.fields.removeById("c94ndl04");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "flngas50",
                name: "exercise_session",
                type: "relation",
                required: false,
                presentable: false,
                collectionId: "qj6ssich32lcxru",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        collection.name = "exercise_logs";

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "c94ndl04",
                name: "exercise",
                type: "relation",
                required: true,
                presentable: true,
                collectionId: "s4f0lpy3ibkgfqp",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
            }),
        );

        // remove
        collection.fields.removeById("flngas50");

        return app.save(collection);
    },
);
