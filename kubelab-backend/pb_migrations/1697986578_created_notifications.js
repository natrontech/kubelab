/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = new Collection({
            id: "r2q6rrbyred18kq",
            name: "notifications",
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
                    id: "1oiscevm",
                    name: "type",
                    type: "select",
                    required: true,
                    presentable: true,
                    maxSelect: 1,
                    values: ["help"],
                },
                {
                    system: false,
                    id: "a3furdsq",
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
                    id: "wwksthrr",
                    name: "done",
                    type: "bool",
                    required: false,
                    presentable: true,
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
        const collection = app.findCollectionByNameOrId("r2q6rrbyred18kq");

        return app.delete(collection);
    },
);
