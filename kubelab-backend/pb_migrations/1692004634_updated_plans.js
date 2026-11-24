migrate(
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "eldb7j7p",
                name: "features",
                type: "relation",
                required: true,
                collectionId: "vknl4jpc8e5wlbv",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 2147483647,
            }),
        );

        // add
        collection.fields.add(
            new RelationField({
                system: false,
                id: "srzysrtq",
                name: "optionalFeatures",
                type: "relation",
                required: false,
                collectionId: "vknl4jpc8e5wlbv",
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 2147483647,
            }),
        );

        // update
        collection.fields.add(
            new TextField({
                system: false,
                id: "jhgt65nx",
                name: "name",
                type: "text",
                required: true,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        // update
        collection.fields.add(
            new TextField({
                system: false,
                id: "mbuxpqro",
                name: "description",
                type: "text",
                required: true,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        // update
        collection.fields.add(
            new NumberField({
                system: false,
                id: "qe5g2utb",
                name: "price",
                type: "number",
                required: true,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId("twr8eflpoom78k9");

        // remove
        collection.fields.removeById("eldb7j7p");

        // remove
        collection.fields.removeById("srzysrtq");

        // update
        collection.fields.add(
            new TextField({
                system: false,
                id: "jhgt65nx",
                name: "name",
                type: "text",
                required: false,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        // update
        collection.fields.add(
            new TextField({
                system: false,
                id: "mbuxpqro",
                name: "description",
                type: "text",
                required: false,
                min: null,
                max: null,
                pattern: "",
            }),
        );

        // update
        collection.fields.add(
            new NumberField({
                system: false,
                id: "qe5g2utb",
                name: "price",
                type: "number",
                required: false,
                min: null,
                max: null,
            }),
        );

        return app.save(collection);
    },
);
