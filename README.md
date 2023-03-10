# Task Manager

## Requirements

You need:
- yarn
- docker

## Running the app

```bash
# Run in docker (bootstraps the whole app)
$ yarn run start:bootstrap

# Run message queue consumer
$ yarn run start:consumer
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
