/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const collection = new Collection({
            id: "jibt2vep48ufd22",
            name: "faqs",
            type: "base",
            system: false,
            indexes: [],
            listRule: "",
            viewRule: "",
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    system: false,
                    id: "e9bldrjo",
                    name: "question",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "qrlumdkc",
                    name: "answer",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
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
        const collection = app.findCollectionByNameOrId("jibt2vep48ufd22");

        return app.delete(collection);
    },
);
