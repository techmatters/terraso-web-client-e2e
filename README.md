# Terraso Web Client E2E Tests

## Requirements

- Docker: Version 20.10.10
- Node: Version 16.13.0
- Npm: Version 8.1.0

## Environment Setup

Set up your environment file

```sh
$ cp .env.sample .env
```

In the `.env` file:

- `AUTH_TOKEN`: Set based on your test user token.
- `BASE_URL`: Set based on the environment you want to test against.
- `COOKIE_DOMAIN`: Set based on the environment you want to test against.

## Available Scripts

In the project directory, you can run:

### `make build`

Builds docker image for local environment

### `make run`

Runs the e2e tests in docker environment

### `make lint`

Runs eslint to check code style
