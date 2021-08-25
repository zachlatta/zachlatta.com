package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	basedir := os.Getenv("BASEDIR")
	if basedir == "" {
		log.Fatal("$BASEDIR must be set")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "2022"
	}

	log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.Dir(basedir+"/public/"))))
}
