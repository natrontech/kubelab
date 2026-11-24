migrate(
    (app) => {
        const collection = new Collection({
            id: "s4f0lpy3ibkgfqp",
            name: "exercises",
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
                    id: "ow94rlnx",
                    name: "title",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "ukrbpgyw",
                    name: "description",
                    type: "text",
                    required: false,
                    min: null,
                    max: null,
                    pattern: "",
                },
                {
                    system: false,
                    id: "qpleqnzf",
                    name: "docs",
                    type: "url",
                    required: false,
                    exceptDomains: null,
                    onlyDomains: null,
                },
                {
                    system: false,
                    id: "lnv6grdi",
                    name: "hint",
                    type: "url",
                    required: false,
                    exceptDomains: null,
                    onlyDomains: null,
                },
                {
                    system: false,
                    id: "lslokljx",
                    name: "solution",
                    type: "url",
                    required: false,
                    exceptDomains: null,
                    onlyDomains: null,
                },
                {
                    system: false,
                    id: "1opfp3c3",
                    name: "check",
                    type: "url",
                    required: false,
                    exceptDomains: null,
                    onlyDomains: null,
                },
                {
                    system: false,
                    id: "oud4eihs",
                    name: "bootstrap",
                    type: "url",
                    required: false,
                    exceptDomains: null,
                    onlyDomains: null,
                },
                {
                    system: false,
                    id: "uao3gxwr",
                    name: "agentRunning",
                    type: "bool",
                    required: false,
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
        const collection = app.findCollectionByNameOrId("s4f0lpy3ibkgfqp");

        return app.delete(collection);
    },
);
