#!/usr/bin/env bash -c make

SRC=./event-lite.js
DEST=./dist/event-lite.min.js
TESTS=test/*.js

DOCS_DIR=./gh-pages
DOC_HTML=./gh-pages/index.html
DOCS_CSS_SRC=./assets/jsdoc.css
DOCS_CSS_DEST=./gh-pages/styles/jsdoc-default.css

all: $(DEST) jsdoc

clean:
	rm -fr $(DEST)

$(DEST): $(SRC)
	./node_modules/.bin/uglifyjs $(SRC) -c -m -o $(DEST)

test: jshint $(DEST)
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(SRC) $(TESTS)

jsdoc: $(DOC_HTML)

$(DOC_HTML): README.md $(SRC) $(DOCS_CSS_SRC)
	mkdir -p $(DOCS_DIR)
	./node_modules/.bin/jsdoc -d $(DOCS_DIR) -R README.md $(SRC)
	cat $(DOCS_CSS_SRC) >> $(DOCS_CSS_DEST)
	rm -f $(DOCS_DIR)/*.js.html
	for f in $(DOCS_DIR)/*.html; do perl -i -pe 's#</a> on .* 201.* GMT.*##' $$f; done
	for f in $(DOCS_DIR)/*.html; do perl -i -pe 's#<a href=".*.js.html">.*line.*line.*</a>##' $$f; done

.PHONY: all clean test jshint jsdoc
