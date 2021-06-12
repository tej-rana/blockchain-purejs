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

`$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`  

Subsequent connections will keep adding to the PEERS sockets

`$ HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001, ws://localhost:5002 npm run dev`

## Endpoints

Assume `url = http://localhost:3001`

### GET Block
To view block information send a `GET` request to one of the http ports at `{url}\blocks`
Example: `http:\\localhost:3001\blocks`

### MINE Block
To mine block make a `POST` request with json body to endpoint `{url}\mine`

```
{
    "data": "test"
}
```

### GET Transactions
To view all transactions send a `GET` request to `{url}\transactions`

Sample output looks like this.

```
[
    {
        "id": "d6394000-cb15-11eb-b70b-c77059e46ace",
        "input": {
            "timestamp": 1623458044796,
            "amount": 500,
            "address": "04b51da4db2955db03fbbb827e71d89d92a36c98d70eecba8df939f4649830b8b7046420b9fd2cd26e49158c195c87f6818ceb7937eada05849720bd53aa65f0e2",
            "signature": {
                "r": "38a9d83e2170a331eb906d48d045adf15a8f7c529ab26b98409586bd74ce910a",
                "s": "6d2cda5fdc3bc0055f75390b98d168c4171818d2b0a1d6cb892ecf43fde61c5a",
                "recoveryParam": 1
            }
        },
        "outputs": [
            {
                "amount": 450,
                "address": "04b51da4db2955db03fbbb827e71d89d92a36c98d70eecba8df939f4649830b8b7046420b9fd2cd26e49158c195c87f6818ceb7937eada05849720bd53aa65f0e2"
            },
            {
                "amount": 35,
                "address": "r4ndom-4ddr355"
            },
            {
                "amount": 15,
                "address": "r4ndom-4ddr355"
            }
        ]
    },
    {
        "id": "026785b0-cb16-11eb-a552-93fa09814d0e",
        "input": {
            "timestamp": 1623458095499,
            "amount": 500,
            "address": "04d3d85abc1ed6fcd1fce67b6cc7af7fd3384df9089da65b7770520163fdb8191bb15a5bef9f124dc6a04d5f6f8e1eb79afe8fa8996a0101235d2aa4e094998b8f",
            "signature": {
                "r": "67f799dc45ba3b7f279ed64398127f625a1451d14937526bb268b581ababba23",
                "s": "dd9a34d3b0c35eb901745ec60a5ec6b10a7146904ea0b90d940135e9a1061b0b",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 425,
                "address": "04d3d85abc1ed6fcd1fce67b6cc7af7fd3384df9089da65b7770520163fdb8191bb15a5bef9f124dc6a04d5f6f8e1eb79afe8fa8996a0101235d2aa4e094998b8f"
            },
            {
                "amount": 75,
                "address": "new-4ddr355"
            }
        ]
    }
]
```


### POST Transaction
To post transaction send a `POST` request to `{url}\transactions` with body

```
{
    "data": 
    {
        "recipient": "r4ndom-4ddr355",
        "amount": 20
    }
}
```

### GET WALLET ADDRESS (PUBLIC KEY)
To get wallet address for recipient send a `GET` request to `{url}\addresses`

Your response looks like this.

```
{
"address": "042015c376f8b593cf31d30d5db7fcc9923aa8fbc561bd7e67a492b8814078b8ab70e322f954cfcf59f329e88de68d8947dbe7f5d037612ed8f69cb6951d8718bd"
}
```
