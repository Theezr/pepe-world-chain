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

### createFirstPepe

```
./bin/run transaction:create nftFactory createFirstPepe 10000000 --params='{"amount": "100000000", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty --key-derivation-path="m/44'/134'/45'"

./bin/run transaction:create stake createFirstPepe 10000000 --params='{"type": "lemonadStand", "address": "klycjt7kexdqkb3yuezbpb7ba5ozwwnsyw7xggmm4"}' --json --pretty --key-derivation-path="m/44'/134'/45'"
```

### stakePepe

```
./bin/run transaction:create stake stakePepe 10000000 --params='{"nftID": "01371337310000000000000000"}' --json --pretty --key-derivation-path="m/44'/134'/45'"
```

### unstakePepe

```
./bin/run transaction:create stake unstakePepe 10000000 --params='{"nftID": "01371337310000000000000000"}' --json --pretty --key-derivation-path="m/44'/134'/45'"
```

### claimRewards

```
./bin/run transaction:create stake claimRewards 10000000 --params='{"nftID": "01371337310000000000000000"}' --json --pretty --key-derivation-path="m/44'/134'/45'"
```

### nft

```
 ./bin/run transaction:create mint createNft 10000000 --params='{"amount": "100000000", "recipient": "kly4mba244me87reyg9fegcy2cesdfw6gq9r8we5x"}' --json --pretty
```

### Upgrade nft

```
 ./bin/run transaction:create mint upgradeNft 10000000 --params='{"module": "mint", "nftID": "013713377c7c7e160000000000000000", attri}' --json --pretty
```

### Upgrade Business

```
 ./bin/run transaction:create stake upgradeBusiness 10000000 --params='{"nftID": "01371337000000010000000000000001"}' --json --pretty --key-derivation-path="m/44'/134'/45'"
```

### getStakeRewardsForNft

```
./bin/run endpoint:invoke stake_getStakeRewardsForNft '{"nftID": "01371337310000000000000000"}'
./bin/run endpoint:invoke stake_getUpgradeCost '{"nftID": "01371337000000010000000000000001"}'
./bin/run endpoint:invoke stake_getAllNftTypes  --json --pretty
```

## Drip Plugin

```
./bin/run endpoint:invoke drip_fundTokens '{"address": "klyzrja9we9f2hvtc6uoxtbwutb9b8cqmde8vnfro"}' --pretty

./bin/run endpoint:invoke drip_mintPepeBusiness '{"address": "klycnpgo6unchuc4cdvetp4nb78ayfhs5d5cfft7b", "type":"lemonadeStand"}' --pretty

./bin/run endpoint:invoke drip_unstakePepe '{"nftID": "01371337000000010000000000000000"}' --pretty
```

```
./bin/run endpoint:invoke drip_authorize '{"password": "testtest", "enable": true}' --pretty
```

### Get token balances

```
./bin/run endpoint:invoke token_getBalances '{"address":"kly22hwq7ejuopapxz7m8tq6w3aokvmym36vjkjot"}' --pretty
```

```
./bin/run endpoint:invoke token_getBalance '{"tokenID": "0137133700000000", "address":"kly22hwq7ejuopapxz7m8tq6w3aokvmym36vjkjot"}' --pretty

./bin/run endpoint:invoke drip_getNftsForAddress '{"address": "klycnpgo6unchuc4cdvetp4nb78ayfhs5d5cfft7b"}' --pretty
```

### Get nft balances

```
./bin/run endpoint:invoke nft_getNFTs '{"address":"kly22hwq7ejuopapxz7m8tq6w3aokvmym36vjkjot"}' --pretty
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
