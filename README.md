## Description

Simple Ethereum Indexer using NestJS.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
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

## TODO
Features to be added:
- [ ] Improve missing block watchdog to fetch blockes missed due to ws disconnection.

Fixes and improvements:
- [ ] Add db migration logic
- [ ] Add more error handling
- [ ] Add tests


Nest is [MIT licensed](LICENSE).
