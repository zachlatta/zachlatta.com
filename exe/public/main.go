// This is a static file server, which will serve files in $BASEDIR/public
// (tracked in git), and fallback to files in $BASEDIR/db/public/, which are
// expected to be stored on a NAS.
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var basedir string

func main() {
	basedir = os.Getenv("BASEDIR")
	if basedir == "" {
		log.Fatal("$BASEDIR must be set")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "2022"
	}

	publicInGit := basedir + "/public"
	publicInDB := basedir + "/db/public"

	// create db/public/ if it doesn't exist
	if _, err := os.Stat(publicInDB); os.IsNotExist(err) {
		if err := os.Mkdir(publicInDB, os.ModeDir); err != nil {
			log.Fatal("error creating db/public/:", err)
		}
	}

	gitFileServer := http.FileServer(http.Dir(publicInGit))
	dbFileServer := http.FileServer(http.Dir(publicInDB))

	log.Fatal(http.ListenAndServe(":"+port, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fileServerToUse := gitFileServer

		path, err := filepath.Abs(r.URL.Path)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		pathInGit := filepath.Join(publicInGit, path)

		_, err = os.Stat(pathInGit)
		if os.IsNotExist(err) {
			fileServerToUse = dbFileServer
		}

		fileServerToUse.ServeHTTP(w, r)
	})))
}
