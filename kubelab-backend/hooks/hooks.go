package hooks

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"ganigeorgiev.com/pocketbase/dbx"
	"ganigeorgiev.com/pocketbase/pocketbase"
	"ganigeorgiev.com/pocketbase/pocketbase/core"
)

func PocketBaseInit(app *pocketbase.PocketBase) {
	// Dispatch configured actions only after record changes succeed
	modelHandler := func(event string) func(*core.RecordEvent) error {
		return func(e *core.RecordEvent) error {
			if err := e.Next(); err != nil {
				return err
			}
			executeEventActions(e.App, event, e.Record.Collection().Name, e.Record)
			return nil
		}
	}
	app.OnRecordAfterCreateSuccess().BindFunc(modelHandler("insert"))
	app.OnRecordAfterUpdateSuccess().BindFunc(modelHandler("update"))
	app.OnRecordAfterDeleteSuccess().BindFunc(modelHandler("delete"))
}

func executeEventActions(app core.App, event string, table string, record *core.Record) {
	// TODO: Load and cache this. Reload only on changes to "hooks" table
	rows := []dbx.NullStringMap{}
	app.DB().Select("action_type", "action", "action_params", "expands").
		From("hooks").
		Where(dbx.HashExp{"collection": table, "event": event, "disabled": false}).
		All(&rows)
	for _, row := range rows {
		action_type := row["action_type"].String
		action := row["action"].String
		action_params := row["action_params"].String
		expands := strings.Split(row["expands"].String, ",")
		app.ExpandRecord(record, expands, func(c *core.Collection, ids []string) ([]*core.Record, error) {
			return app.FindRecordsByIds(c.Name, ids, nil)
		})
		if err := executeEventAction(event, table, action_type, action, action_params, record); err != nil {
			log.Println("ERROR", err)
		}
	}
}

func executeEventAction(event, table, action_type, action, action_params string, record *core.Record) error {
	log.Printf("event:%s, table: %s, action: %s\n", event, table, action)
	switch action_type {
	case "command":
		return doCommand(action, action_params, record)
	case "post":
		return doPost(action, action_params, record)
	default:
		return errors.New(fmt.Sprintf("Unknown action_type: %s", action_type))
	}
}

func doCommand(action, action_params string, record *core.Record) error {
	cmd := exec.Command(action, action_params)
	if w, err := cmd.StdinPipe(); err != nil {
		return err
	} else {
		if r, err := cmd.StdoutPipe(); err != nil {
			return err
		} else {
			go func() {
				defer w.Close()
				defer r.Close()
				log.Println("-------------------------------")
				defer log.Println("-------------------------------")
				if err := cmd.Start(); err != nil {
					log.Printf("command start failed: %s %+v\n", action, err)
				} else {
					// write JSON into the pipe and close
					json.NewEncoder(w).Encode(record)
					w.Close()
					if err := cmd.Wait(); err != nil {
						log.Printf("command wait failed: %s %+v\n", action, err)
					}
				}
			}()
			// read pipe's stdout and copy to ours (in parallel to the above goroutine)
			io.Copy(os.Stdout, r)
		}
	}
	return nil
}

func doPost(action, action_params string, record *core.Record) error {
	r, w := io.Pipe()
	defer w.Close()
	go func() {
		defer r.Close()
		if resp, err := http.Post(action, "application/json", r); err != nil {
			log.Println("POST failed", action, err)
		} else {
			io.Copy(os.Stdout, resp.Body)
		}
	}()
	if err := json.NewEncoder(w).Encode(record); err != nil {
		log.Println("ERROR writing to pipe", err)
	}
	return nil
}
