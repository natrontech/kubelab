/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = new Collection({
            id: "w8voaruazjzwfdy",
            name: "companies",
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
                    id: "ivpolooz",
                    name: "name",
                    type: "text",
                    required: true,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "vl0yntjz",
                    name: "logo",
                    type: "file",
                    required: true,
                    maxSelect: 1,
                    maxSize: 5242880,
                    mimeTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/svg+xml",
                        "image/gif",
                        "image/webp",
                    ],
                    thumbs: [],
                    protected: false,
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
        const collection = app.findCollectionByNameOrId("w8voaruazjzwfdy");

        return app.delete(collection);
    },
);
