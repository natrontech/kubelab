package controller

import (
	"io"
	"log"
	"net/http"

	"github.com/natrontech/kubelab/pkg/helm"
	"github.com/pocketbase/pocketbase/core"
)

func namespaceName(e *core.RecordUpdateEvent, lab string) string {
	return helm.GetNamespaceName(lab, e.Record.GetString("user"))
}

func logAndReturnErr(err error) error {
	log.Println(err)
	return err
}

func fetchBodyFromURL(url string) ([]byte, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, logAndReturnErr(err)
	}
	defer response.Body.Close()
	return io.ReadAll(response.Body)
}
