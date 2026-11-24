package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"ganigeorgiev.com/pocketbase/pocketbase"
	"ganigeorgiev.com/pocketbase/pocketbase/core"
	"ganigeorgiev.com/pocketbase/pocketbase/tools/security"
	"github.com/natrontech/kubelab/hooks"
	"github.com/natrontech/kubelab/pkg/controller"
)

func TestMigratedApplication(t *testing.T) {
	// Apply the complete history to a new database without requiring Kubernetes access
	app := newApp(pocketbase.Config{DefaultDataDir: t.TempDir()})
	if err := app.Bootstrap(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { app.ResetBootstrapState() })
	if err := app.RunAllMigrations(); err != nil {
		t.Fatal(err)
	}

	// Seed related records to exercise the migrated validation and relation fields
	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		t.Fatal(err)
	}
	user := core.NewRecord(users)
	user.SetPassword(security.RandomString(32))
	user.Set("username", "upgradeuser")
	user.Set("role", "user")
	if err := app.Save(user); err != nil {
		t.Fatal(err)
	}
	labs, err := app.FindCollectionByNameOrId("labs")
	if err != nil {
		t.Fatal(err)
	}
	lab := core.NewRecord(labs)
	lab.Set("title", "Upgrade lab")
	if err := app.Save(lab); err != nil {
		t.Fatal(err)
	}
	exercises, err := app.FindCollectionByNameOrId("exercises")
	if err != nil {
		t.Fatal(err)
	}
	exercise := core.NewRecord(exercises)
	exercise.Set("title", "Upgrade exercise")
	exercise.Set("lab", lab.Id)
	if err := app.Save(exercise); err != nil {
		t.Fatal(err)
	}

	// Repeated synchronization must create one stopped session per user and resource
	for range 2 {
		if err := controller.AutoSessionSyncController(app); err != nil {
			t.Fatal(err)
		}
	}
	for _, scenario := range []struct {
		collection string
		relation   string
		id         string
		running    string
	}{
		{"lab_sessions", "lab", lab.Id, "clusterRunning"},
		{"exercise_sessions", "exercise", exercise.Id, "agentRunning"},
	} {
		records, err := app.FindAllRecords(scenario.collection)
		if err != nil {
			t.Fatal(err)
		}
		if len(records) != 1 {
			t.Fatalf("%s: expected one session, got %d", scenario.collection, len(records))
		}
		record := records[0]
		if record.GetString("user") != user.Id || record.GetString(scenario.relation) != scenario.id || record.GetBool(scenario.running) {
			t.Errorf("%s: session relations or running state changed", scenario.collection)
		}
	}
	// Invalid relation changes must fail before the request hook can contact Kubernetes
	session, err := app.FindFirstRecordByData("lab_sessions", "user", user.Id)
	if err != nil {
		t.Fatal(err)
	}
	session.Set("lab", "missinglab00000")
	event := &core.RecordRequestEvent{Record: session, RequestEvent: &core.RequestEvent{App: app}}
	event.Collection = session.Collection()
	continued := false
	err = app.OnRecordUpdateRequest().Trigger(event, func(e *core.RecordRequestEvent) error {
		continued = true
		return nil
	})
	if err == nil || continued {
		t.Fatal("invalid session reached provisioning or persistence")
	}

	// The new success hooks must still send the changed record to configured actions
	received := make(chan map[string]any, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		received <- payload
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()
	hooks.PocketBaseInit(app)
	hookCollection, err := app.FindCollectionByNameOrId("hooks")
	if err != nil {
		t.Fatal(err)
	}
	hookRecord := core.NewRecord(hookCollection)
	hookRecord.Set("collection", "labs")
	hookRecord.Set("event", "update")
	hookRecord.Set("action_type", "post")
	hookRecord.Set("action", server.URL)
	if err := app.Save(hookRecord); err != nil {
		t.Fatal(err)
	}
	lab.Set("title", "Updated lab")
	if err := app.Save(lab); err != nil {
		t.Fatal(err)
	}
	select {
	case payload := <-received:
		if payload["id"] != lab.Id || payload["title"] != "Updated lab" {
			t.Error("configured action received an incorrect record")
		}
	case <-time.After(5 * time.Second):
		t.Fatal("configured record action did not run")
	}

}
