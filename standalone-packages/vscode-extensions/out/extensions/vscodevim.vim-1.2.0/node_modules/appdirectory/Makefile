test:
	./node_modules/mocha/bin/mocha --reporter spec

test-cov:
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R dot

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: test