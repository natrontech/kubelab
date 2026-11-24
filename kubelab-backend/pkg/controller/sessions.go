package controller

import (
	"fmt"

	"ganigeorgiev.com/pocketbase/dbx"
	"ganigeorgiev.com/pocketbase/pocketbase"
	"ganigeorgiev.com/pocketbase/pocketbase/core"
)

func AutoSessionSyncController(app *pocketbase.PocketBase) error {

	// get each user with role "user"
	users, err := app.FindAllRecords("users", dbx.NewExp("LOWER(role) = {:role}", dbx.Params{"role": "user"}))
	if err != nil {
		fmt.Println("Error getting users: ", err)
		return err
	}

	// get each lab
	labs, err := app.FindAllRecords("labs")
	if err != nil {
		fmt.Println("Error getting labs: ", err)
		return err
	}

	// get each exercise
	exercises, err := app.FindAllRecords("exercises")
	if err != nil {
		return err
	}

	labSessionsCollection, err := app.FindCollectionByNameOrId("lab_sessions")
	if err != nil {
		return err
	}

	exerciseSessionsCollection, err := app.FindCollectionByNameOrId("exercise_sessions")
	if err != nil {
		return err
	}

	// go through each user
	for _, user := range users {
		// get lab_sessions for user
		labSessions, err := app.FindAllRecords("lab_sessions", dbx.NewExp("user = {:user}", dbx.Params{"user": user.Id}))
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
				record := core.NewRecord(labSessionsCollection)
				record.Set("user", user.Id)
				record.Set("lab", lab.Id)
				record.Set("clusterRunning", false)

				err := app.Save(record)
				if err != nil {
					return err
				}
			}
		}

		// get exercise_sessions for user
		exerciseSessions, err := app.FindAllRecords("exercise_sessions", dbx.NewExp("user = {:user}", dbx.Params{"user": user.Id}))
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
				record := core.NewRecord(exerciseSessionsCollection)
				record.Set("user", user.Id)
				record.Set("exercise", exercise.Id)
				record.Set("agentRunning", false)

				err := app.Save(record)
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
				err := app.Delete(labSession)
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
				err := app.Delete(exerciseSession)
				if err != nil {
					return err
				}
			}
		}

	}

	return nil
}
