package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/viper"
)

type (
	Config struct {
		PORT string `mapstructure:"PORT" yaml:"PORT" json:"port"`
		Name string `mapstructure:"NAME" yaml:"NAME" json:"name"`
	}
)

func NewAppConfig() *Config {
	conf := &Config{}
	ex, err := os.Executable()
	if err != nil {
		panic("panic in config parser : " + err.Error())
	}
	path := filepath.Join(filepath.Dir(ex), "config")
	if err := ensureDir(path); err != nil {
		panic("panic in config parser : " + err.Error())
	}

	if err := ensureFile(filepath.Join(path, "config.yaml")); err != nil {
		panic("panic in config parser : " + err.Error())
	}

	fmt.Println("Config directory:", path)

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(path)
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := viper.ReadInConfig(); err != nil {
		panic("panic in config parser : " + err.Error())
	}

	viper.SetDefault("NAME", "BSM 370 Computer Interface")

	viper.WriteConfig()

	err = viper.Unmarshal(conf)
	if err != nil {
		panic(err)
	}
	return conf
}
