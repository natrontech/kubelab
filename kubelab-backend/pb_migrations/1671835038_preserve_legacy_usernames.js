migrate(
    (app) => {
        const users = app.findCollectionByNameOrId("users");
        // Existing databases receive this field from PocketBase's system upgrade
        if (users.fields.getByName("username")) return;

        users.fields.add(
            new TextField({
                id: "legacyusername",
                name: "username",
                required: true,
                min: 3,
                max: 150,
                pattern: "^[\\w][\\w.\\-]*$",
                autogeneratePattern: "users[0-9]{6}",
            }),
        );
        users.fields.getByName("email").required = false;
        users.addIndex(
            "_users_username_idx",
            true,
            "username COLLATE NOCASE",
            "",
        );
        users.passwordAuth.identityFields = ["email", "username"];
        return app.save(users);
    },
    (app) => {
        const users = app.findCollectionByNameOrId("users");
        // Preserve username fields that were migrated from an existing installation
        if (users.fields.getByName("username")?.id !== "legacyusername") return;
        users.fields.getByName("email").required = true;
        users.fields.removeByName("username");
        users.removeIndex("_users_username_idx");
        users.passwordAuth.identityFields = ["email"];
        return app.save(users);
    },
);
