# Getting Started with Klayr Blockchain Client

This project was bootstrapped with [Klayr SDK](https://github.com/Klayrhq/klayr-sdk)

### Start a node

```
./bin/run start
yarn build && ./bin/run start --config config/custom_config.json --overwrite-config
```

### Mint module

```
 ./bin/run transaction:create mint baseMint 10000000 --params='{"amount": "100000000", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty
```

### nft

```
 ./bin/run transaction:create mint createNft 10000000 --params='{"amount": "100000000", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty
```

### Upgrade nft

```
 ./bin/run transaction:create mint upgradeNft 10000000 --params='{"module": "mint", "nftID": "013713377c7c7e160000000000000000", attri}' --json --pretty
```

### Drip Plugin

```
./bin/run endpoint:invoke drip_fundTokens '{"address": "klyopmzg5g2dem64amsdfy32m86krd8y5p56nd6b9"}' --pretty
```

```
./bin/run endpoint:invoke drip_authorize '{"password": "testtest", "enable": true}' --pretty
```

### Get token balances

```
./bin/run endpoint:invoke token_getBalances '{"address":"klyopmzg5g2dem64amsdfy32m86krd8y5p56nd6b9"}' --pretty
```

### Get nft balances

```
./bin/run endpoint:invoke nft_getNFTs '{"address":"kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
```

### Add a new module

```
klayr generate:module ModuleName
// Example
klayr generate:module token
```

### Add a new command

```
klayr generate:command ModuleName Command
// Example
klayr generate:command token transfer
```

### Add a new plugin

```
klayr generate:plugin PluginName
// Example
klayr generate:plugin httpAPI
```

## Learn More

You can learn more in the [documentation](https://klayr.xyz/documentation/klayr-sdk/).
