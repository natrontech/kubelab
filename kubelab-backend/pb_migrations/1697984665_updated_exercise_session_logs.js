/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        // add
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
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        // remove
        collection.fields.removeById("2pfxi0ho");

        return app.save(collection);
    },
);
