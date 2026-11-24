/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = new Collection({
            id: "juzwmxmth0oqv89",
            name: "exercise_logs",
            type: "base",
            system: false,
            indexes: [],
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    system: false,
                    id: "qy80deun",
                    name: "user",
                    type: "relation",
                    required: true,
                    presentable: true,
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: false,
                    minSelect: null,
                    maxSelect: 1,
                },
                {
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
                },
                {
                    system: false,
                    id: "40uyszyy",
                    name: "timestamp",
                    type: "date",
                    required: true,
                    presentable: true,
                    min: "",
                    max: "",
                },
                {
                    name: "created",
                    type: "autodate",
                    onCreate: true,
                },
                {
                    name: "updated",
                    type: "autodate",
                    onCreate: true,
                    onUpdate: true,
                },
            ],
        });

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("juzwmxmth0oqv89");

        return app.delete(collection);
    },
);
