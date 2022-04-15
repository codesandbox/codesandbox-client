#!/usr/bin/env bash -c make

SRC=./int64-buffer.js
TESTS=*.json ./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/int64-buffer.min.js
JSGZIP=./dist/int64-buffer.min.js.gz

all: test $(JSGZIP)

clean:
	rm -fr $(JSDEST)

$(DIST):
	mkdir -p $(DIST)

$(JSDEST): $(SRC) $(DIST)
	./node_modules/.bin/uglifyjs $(SRC) -c -m -o $(JSDEST)

$(JSGZIP): $(JSDEST)
	gzip -9 < $(JSDEST) > $(JSGZIP)
	ls -l $(JSDEST) $(JSGZIP)

test:
	@if [ "x$(BROWSER)" = "x" ]; then make test-node; else make test-browser; fi

test-node: jshint mocha

test-browser:
	./node_modules/.bin/zuul -- $(TESTS)

test-browser-local:
	node -e 'process.exit(process.platform === "darwin" ? 0 : 1)' && sleep 1 && open http://localhost:4000/__zuul &
	./node_modules/.bin/zuul --local 4000 -- $(TESTS)

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
