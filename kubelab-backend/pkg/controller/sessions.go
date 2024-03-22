package controller

import (
	"fmt"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
)

func AutoSessionSyncController(app *pocketbase.PocketBase) error {

	// get each user with role "user"
	users, err := app.Dao().FindRecordsByExpr("users", dbx.NewExp("LOWER(role) = {:role}", dbx.Params{"role": "user"}))
	if err != nil {
		fmt.Println("Error getting users: ", err)
		return err
	}

	// get each lab
	labs, err := app.Dao().FindRecordsByExpr("labs")
	if err != nil {
		fmt.Println("Error getting labs: ", err)
		return err
	}

	// get each exercise
	exercises, err := app.Dao().FindRecordsByExpr("exercises")
	if err != nil {
		return err
	}

	labSessionsCollection, err := app.Dao().FindCollectionByNameOrId("lab_sessions")
	if err != nil {
		return err
	}

	exerciseSessionsCollection, err := app.Dao().FindCollectionByNameOrId("exercise_sessions")
	if err != nil {
		return err
	}

	// go through each user
	for _, user := range users {
		// get lab_sessions for user
		labSessions, err := app.Dao().FindRecordsByExpr("lab_sessions", dbx.NewExp("user = {:user}", dbx.Params{"user": user.Id}))
		if err != nil {
			fmt.Println("Error getting lab sessions: ", err)
			return err
		}

		// check if there exists for each lab a lab_session
		for _, lab := range labs {
			found := false
			for _, labSession := range labSessions {
				if labSession.Get("lab") == lab.Id {
					found = true
					break
				}
			}

			if !found {
				record := models.NewRecord(labSessionsCollection)

				form := forms.NewRecordUpsert(app, record)

				form.LoadData(map[string]any{
					"user":           user.Id,
					"lab":            lab.Id,
					"clusterRunning": false,
				})

				err := form.Validate()
				if err != nil {
					return err
				}

				err = form.Submit()
				if err != nil {
					return err
				}
			}
		}

		// get exercise_sessions for user
		exerciseSessions, err := app.Dao().FindRecordsByExpr("exercise_sessions", dbx.NewExp("user = {:user}", dbx.Params{"user": user.Id}))
		if err != nil {
			fmt.Println("Error getting exercise sessions: ", err)
			return err
		}

		// check if there exists for each exercise an exercise_session
		for _, exercise := range exercises {
			found := false
			for _, exerciseSession := range exerciseSessions {
				if exerciseSession.Get("exercise") == exercise.Id {
					found = true
					break
				}
			}

			if !found {
				record := models.NewRecord(exerciseSessionsCollection)

				form := forms.NewRecordUpsert(app, record)

				form.LoadData(map[string]any{
					"user":         user.Id,
					"exercise":     exercise.Id,
					"agentRunning": false,
				})

				err := form.Validate()
				if err != nil {
					return err
				}

				err = form.Submit()
				if err != nil {
					return err
				}
			}
		}

		// check if there exist sessions which don't belong to any lab or exercise and delete them
		for _, labSession := range labSessions {
			found := false
			for _, lab := range labs {
				if labSession.Get("lab") == lab.Id {
					found = true
					break
				}
			}

			if !found {
				err := app.Dao().DeleteRecord(labSession)
				if err != nil {
					return err
				}
			}
		}

		for _, exerciseSession := range exerciseSessions {
			found := false
			for _, exercise := range exercises {
				if exerciseSession.Get("exercise") == exercise.Id {
					found = true
					break
				}
			}

			if !found {
				err := app.Dao().DeleteRecord(exerciseSession)
				if err != nil {
					return err
				}
			}
		}

	}

	return nil
}
