# Daily check-in contract

Solidity `DailyCheckIn.sol`: one `checkIn()` per UTC day (`block.timestamp / 1 days`), `msg.value` must be zero, optional streak when consecutive days are recorded.

## Test

```bash
forge test
```

## Deploy (Base mainnet)

```bash
forge create src/DailyCheckIn.sol:DailyCheckIn --rpc-url $BASE_RPC_URL --private-key $KEY
```

Or use `script/DeployDailyCheckIn.s.sol` with `forge script`.

**Deployed (Base mainnet):** `0x096cA71ad016DAEc85765474F6ec8aaa168f56C1`  
Deploy tx: `0x07731ffdc18e319e24ede720ab1c99bc048a757ff7cd87521c83232264a3bdbb`

Set `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in `web/.env.local` and Vercel to this address.
