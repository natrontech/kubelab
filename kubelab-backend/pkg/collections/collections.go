package collections

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// InitializeCollections creates all required collections if they don't exist
func InitializeCollections(app *pocketbase.PocketBase) error {
	// Phase 1: Create base collections without relations
	baseCollections := []func(*pocketbase.PocketBase) error{
		createUsersCollectionBase,
		createLabsCollection,
		createHooksCollection,
		createPlansCollection,
		createFaqsCollection,
		createCompaniesCollection,
	}

	for _, fn := range baseCollections {
		if err := fn(app); err != nil {
			return err
		}
	}

	// Phase 2: Create collections with relations
	relatedCollections := []func(*pocketbase.PocketBase) error{
		createExercisesCollection,
		createFeaturesCollection,
		createLabSessionsCollection,
		createExerciseSessionsCollection,
		createExerciseSessionLogsCollection,
		createNotificationsCollection,
	}

	for _, fn := range relatedCollections {
		if err := fn(app); err != nil {
			return err
		}
	}

	return nil
}

func createUsersCollectionBase(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("users")

	// If collection exists, check if it has all required fields
	if err == nil {
		needsUpdate := false

		// Check if role field exists
		if collection.Fields.GetByName("role") == nil {
			collection.Fields.Add(
				&core.TextField{
					Name:     "role",
					Required: true,
				},
			)
			needsUpdate = true
		}

		if collection.Fields.GetByName("plan") == nil {
			collection.Fields.Add(
				&core.TextField{
					Name:     "plan",
					Required: false,
				},
			)
			needsUpdate = true
		}

		if collection.Fields.GetByName("company") == nil {
			collection.Fields.Add(
				&core.TextField{
					Name:     "company",
					Required: false,
				},
			)
			needsUpdate = true
		}

		if collection.Fields.GetByName("workshop") == nil {
			collection.Fields.Add(
				&core.BoolField{
					Name: "workshop",
				},
			)
			needsUpdate = true
		}

		if needsUpdate {
			return app.Save(collection)
		}
		return nil
	}

	// Create new collection
	collection = core.NewAuthCollection("users")
	collection.ListRule = types.Pointer("@request.auth.id != ''")
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = nil
	collection.UpdateRule = types.Pointer("@request.auth.id = id")
	collection.DeleteRule = types.Pointer("@request.auth.id = id")

	// Add custom fields
	collection.Fields.Add(
		&core.TextField{
			Name:     "role",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "plan",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "company",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "workshop",
		},
	)

	return app.Save(collection)
}

func createLabsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("labs")
	if err == nil {
		return nil
	}

	collection = core.NewBaseCollection("labs")
	collection.ListRule = types.Pointer("@request.auth.id != ''")
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.EditorField{
			Name:     "description",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "icon",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "order",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "active",
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "difficulty",
			Required: false,
		},
	)

	return app.Save(collection)
}

func createExercisesCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("exercises")
	if err == nil {
		return nil
	}

	// Get labs collection ID
	labsCollection, err := app.FindCollectionByNameOrId("labs")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("exercises")
	collection.ListRule = types.Pointer("@request.auth.id != ''")
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.EditorField{
			Name:     "description",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.RelationField{
			Name:         "lab",
			Required:     true,
			CollectionId: labsCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.URLField{
			Name:     "bootstrap",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.URLField{
			Name:     "check",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "order",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "maxScore",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "active",
		},
	)

	return app.Save(collection)
}

func createLabSessionsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("lab_sessions")
	if err == nil {
		return nil
	}

	// Get related collections
	usersCollection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	labsCollection, err := app.FindCollectionByNameOrId("labs")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("lab_sessions")
	collection.ListRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.ViewRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.CreateRule = types.Pointer("@request.auth.id != ''")
	collection.UpdateRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.RelationField{
			Name:         "user",
			Required:     true,
			CollectionId: usersCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.RelationField{
			Name:         "lab",
			Required:     true,
			CollectionId: labsCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "clusterRunning",
		},
	)

	collection.Fields.Add(
		&core.DateField{
			Name:     "lastClusterStart",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.DateField{
			Name:     "lastClusterStop",
			Required: false,
		},
	)

	return app.Save(collection)
}

func createExerciseSessionsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("exercise_sessions")
	if err == nil {
		return nil
	}

	// Get related collections
	usersCollection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	exercisesCollection, err := app.FindCollectionByNameOrId("exercises")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("exercise_sessions")
	collection.ListRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.ViewRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.CreateRule = types.Pointer("@request.auth.id != ''")
	collection.UpdateRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.RelationField{
			Name:         "user",
			Required:     true,
			CollectionId: usersCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.RelationField{
			Name:         "exercise",
			Required:     true,
			CollectionId: exercisesCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "agentRunning",
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "score",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.DateField{
			Name:     "lastAgentStart",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.DateField{
			Name:     "lastAgentStop",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "solved",
		},
	)

	collection.Fields.Add(
		&core.DateField{
			Name:     "solvedAt",
			Required: false,
		},
	)

	return app.Save(collection)
}

func createExerciseSessionLogsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("exercise_session_logs")
	if err == nil {
		return nil
	}

	// Get related collections
	usersCollection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	exerciseSessionsCollection, err := app.FindCollectionByNameOrId("exercise_sessions")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("exercise_session_logs")
	collection.ListRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.ViewRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.CreateRule = types.Pointer("@request.auth.id != ''")
	collection.UpdateRule = nil
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.RelationField{
			Name:         "user",
			Required:     true,
			CollectionId: usersCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.RelationField{
			Name:         "exercise_session",
			Required:     true,
			CollectionId: exerciseSessionsCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "message",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "type",
			Required: true,
		},
	)

	return app.Save(collection)
}

func createHooksCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("hooks")
	if err == nil {
		return nil
	}

	collection = core.NewBaseCollection("hooks")
	collection.ListRule = types.Pointer("@request.auth.role = 'admin'")
	collection.ViewRule = types.Pointer("@request.auth.role = 'admin'")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "table",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "event",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "actionType",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "actionMeta",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "disabled",
		},
	)

	return app.Save(collection)
}

func createPlansCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("plans")
	if err == nil {
		return nil
	}

	collection = core.NewBaseCollection("plans")
	collection.ListRule = types.Pointer("@request.auth.id != ''")
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "description",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "price",
			Required: false,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "active",
		},
	)

	return app.Save(collection)
}

func createFeaturesCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("features")
	if err == nil {
		return nil
	}

	// Get related collections
	plansCollection, err := app.FindCollectionByNameOrId("plans")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("features")
	collection.ListRule = types.Pointer("@request.auth.id != ''")
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.RelationField{
			Name:         "plan",
			Required:     false,
			CollectionId: plansCollection.Id,
			MaxSelect:    1,
		},
	)

	return app.Save(collection)
}

func createFaqsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("faqs")
	if err == nil {
		return nil
	}

	collection = core.NewBaseCollection("faqs")
	collection.ListRule = types.Pointer("")
	collection.ViewRule = types.Pointer("")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "question",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "answer",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "order",
			Required: false,
		},
	)

	return app.Save(collection)
}

func createCompaniesCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("companies")
	if err == nil {
		return nil
	}

	collection = core.NewBaseCollection("companies")
	collection.ListRule = types.Pointer("")
	collection.ViewRule = types.Pointer("")
	collection.CreateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.UpdateRule = types.Pointer("@request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("@request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.FileField{
			Name:      "logo",
			Required:  false,
			MaxSelect: 1,
			MaxSize:   5242880, // 5MB
		},
	)

	collection.Fields.Add(
		&core.NumberField{
			Name:     "order",
			Required: false,
		},
	)

	return app.Save(collection)
}

func createNotificationsCollection(app *pocketbase.PocketBase) error {
	collection, err := app.FindCollectionByNameOrId("notifications")
	if err == nil {
		return nil
	}

	// Get related collections
	usersCollection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}

	collection = core.NewBaseCollection("notifications")
	collection.ListRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.ViewRule = types.Pointer("@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')")
	collection.CreateRule = types.Pointer("@request.auth.id != ''")
	collection.UpdateRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")
	collection.DeleteRule = types.Pointer("user = @request.auth.id || @request.auth.role = 'admin'")

	collection.Fields.Add(
		&core.RelationField{
			Name:         "user",
			Required:     true,
			CollectionId: usersCollection.Id,
			MaxSelect:    1,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "message",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "type",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.BoolField{
			Name: "read",
		},
	)

	return app.Save(collection)
}
