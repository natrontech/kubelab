/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        // update
        collection.fields.add(
            new RelationField({
                system: false,
                id: "flngas50",
                name: "exercise_session",
                type: "relation",
                required: true,
                presentable: true,
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

        // update
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
);
