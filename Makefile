build:
	docker build --tag=techmatters/terraso_web_client_e2e --file=Dockerfile .

clean:
	docker ps --filter name=terraso_web_client_e2e* -aq | xargs docker stop
	docker ps --filter name=terraso_web_client_e2e* -aq | xargs docker rm

run:
	./scripts/run.sh \
		"--name terraso_web_client_e2e" \
		"npx playwright test"

lint:
	./scripts/run.sh \
		"--name terraso_web_client_e2e_lint" \
		"npm run lint-js"

npm:
	./scripts/run.sh \
		"--name terraso_web_client_e2e_npm" \
		"npm $(command)"
