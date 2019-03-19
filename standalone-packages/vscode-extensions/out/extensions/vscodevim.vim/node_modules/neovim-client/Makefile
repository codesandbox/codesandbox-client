TESTS = test/*.js


test:
	@# if any of the files contain 'debugger' statements, start with --debug-brk
	@if find . -name 'node_modules' -prune -o -type f -name '*.js' -print | xargs grep -q '^\s*debugger'; then \
		./node_modules/.bin/mocha --debug-brk $(TESTS); \
		else \
		./node_modules/.bin/mocha $(TESTS); \
		fi
	@echo 'Check index.d.ts type definition.'
	@./node_modules/.bin/tsc --target es5 --module commonjs --noImplicitAny --noEmit test/typescript-test.ts


watch:
	@./node_modules/.bin/nodemon -e js --exec 'make test'


.PHONY: test watch
