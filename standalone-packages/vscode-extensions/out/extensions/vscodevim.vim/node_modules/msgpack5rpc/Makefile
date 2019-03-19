TESTS = test/*.js


test:
	@# if any of the files contain 'debugger' statements, start with --debug-brk
	@if find -name 'node_modules' -prune -o -type f -name '*.js' | xargs grep -q '^\s*debugger'; then \
		./node_modules/.bin/mocha --debug-brk $(TESTS); \
		else \
		./node_modules/.bin/mocha $(TESTS); \
		fi


watch:
	@./node_modules/.bin/nodemon -e js --exec 'make test'


.PHONY: test watch
