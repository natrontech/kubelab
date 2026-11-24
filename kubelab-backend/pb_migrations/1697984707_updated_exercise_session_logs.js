/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        // update
        collection.fields.add(
            new SelectField({
                system: false,
                id: "2pfxi0ho",
                name: "type",
                type: "select",
                required: true,
                presentable: true,
                maxSelect: 1,
                values: ["start", "end"],
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        // update
        collection.fields.add(
            new SelectField({
                system: false,
                id: "2pfxi0ho",
                name: "type",
                type: "select",
                required: false,
                presentable: false,
                maxSelect: 1,
                values: ["start", "end"],
            }),
        );

        return app.save(collection);
    },
);
