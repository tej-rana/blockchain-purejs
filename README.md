# blockhain-purejs
Simple Blockchain project based in Javascript

## Installation

Simply run.

`$ npm i`


## TEST

Run this command to execute unit tests.

`$ npm run test`

To execute a simple dev test run. This will create some blocks and you can observe difficulty adjustments.

`$ npm run test-dev`

## Running

Open separate terminal sessions.

### Start first instance by typing

`$ npm run dev`

This will start a new nodemon http server instance on `port 3001`. It will also listen for socket connections on `port 5001`. You can use http endpoints to view block information and mine. More on this later.

### Start second instances by typing (1st peer)

`$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`  

This will also establish socket connection with first. Every time you mine with either port 3001 or 3002, you will notice in either terminal session new chain being added.

### Subsequent instances (peers connecting)

specify new HTTP_PORT and P2P_PORT and add to PEERS websocket port of the others that have started separated by comma. It will be in the format `ws://localhost:500x`

`$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001,ws://locahost:5002 npm run dev`  

## Endpoints

### GET Block
To view block information send a `GET` request to one of the http ports at `{url}\blocks`
Example: `http:\\localhost:3001\blocks`

### MINE Block
To mine block make a `POST` request with json body to endpoint `{url}\mine`

`{
    "data": "test"
}`



