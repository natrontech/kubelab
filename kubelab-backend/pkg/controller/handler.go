package controller

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func HandleLabSessions(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	if e.Record.GetBool("clusterRunning") {
		return deployVCluster(e, app)
	}
	return deleteClusterResources(e, app)
}

func HandleExerciseSessions(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	if e.Record.GetBool("agentRunning") {
		return setupExerciseResources(e, app)
	}
	return deleteExerciseResources(e, app)
}
