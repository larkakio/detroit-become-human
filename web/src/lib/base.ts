/** Unix day index matching Solidity `block.timestamp / 1 days`. */
export function currentUnixDay(): bigint {
  const sec = BigInt(Math.floor(Date.now() / 1000));
  return sec / BigInt(86400);
}
