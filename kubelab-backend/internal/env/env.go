package env

import (
	"fmt"

	"github.com/caarlos0/env/v8"
)

type config struct {
	Local bool `env:"LOCAL"`
}

var Config config

func Init() {
	if err := env.Parse(&Config); err != nil {
		fmt.Printf("%+v\n", err)
	}

	if Config.Local {
		fmt.Println("Running in local mode")
	}
}
