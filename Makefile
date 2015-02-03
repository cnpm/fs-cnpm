TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 3000
MOCHA_OPTS =

install:
	@npm install --registry=http://registry.npm.taobao.org

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
    --harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
    --require co-mocha \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--require should \
    --require co-mocha \
		$(TESTS) \
		--bail

test-travis:
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		--require should \
    --require co-mocha \
		$(TESTS) \
		--bail

jshint:
	@./node_modules/.bin/jshint ./

autod:
	@node_modules/.bin/autod -w -e example.js --prefix=~
	@$(MAKE) install

.PHONY: test
