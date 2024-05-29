install:
	npm ci

gendiff:
	node/gendiff.js

publish:
	npm publish --dry-run

run:
	node gendiff ./__fixtures__/filepath1.json ./__fixtures__/filepath2.json

test:
	npm test 

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix