// This is a static file server, which will serve files in $BASEDIR/public
// (tracked in git), and fallback to files in $BASEDIR/db/public/, which are
// expected to be stored on a NAS.
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
