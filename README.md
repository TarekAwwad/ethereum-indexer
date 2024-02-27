## Description

Simple Ethereum Indexer using NestJS.

## Installation

```bash
$ yarn install
```

## Running the app

To run the app, an API Key for a web3 provider is required (e.g. Alchemy). 
- Create a `development.env` file in the `config` directory using the provided template.
- Start the database using docker-compose:
```bash
$ docker-compose up -d
```

- Then run the app:
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

The app will start by default at `http://localhost:3000`. It provides the following endpoints:
- `GET /run-config/total` - retrieve the total amount of CHZ transferred (since the start of the program).
- `GET /transaction/:hash` - returns whether the transaction with the given hash is interacting with the CHZ token smart contract.


## TODO
Features to be added:
- [ ] Improve missing block watchdog to fetch blockes missed due to ws disconnection.

Fixes and improvements:
- [ ] Add db migration logic
- [ ] Add more error handling
- [ ] Add tests


Nest is [MIT licensed](LICENSE).
