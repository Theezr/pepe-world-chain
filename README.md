# Getting Started with Klayr Blockchain Client

This project was bootstrapped with [Klayr SDK](https://github.com/Klayrhq/klayr-sdk)

### Start a node

```
./bin/run start
yarn build && ./bin/run start --config config/custom_config.json --overwrite-config
```

### Drip Plugin

```
./bin/run endpoint:invoke drip_fundTokens '{"address": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --pretty
```

```
./bin/run endpoint:invoke drip_authorize '{"password": "testtest", "enable": true}' --pretty
```

### Get token balances

```
./bin/run endpoint:invoke token_getBalances '{"address":"klyznbosu8hm57dgosc5a5ozg9pcbd3natw4jb4t8"}' --pretty
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
