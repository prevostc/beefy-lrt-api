import type { Vault } from '../utils/vaults';
import { type Address, getContract, type PublicClient } from 'viem';
import { BeefyVaultAbi } from '../abi/BeefyVaultAbi';
import { defaultLogger } from '../utils/log';

export async function getWantFromVault(
  vault: Vault,
  users: Address[],
  blockNumber: bigint,
  publicClient: PublicClient
) {
  const callParams = { blockNumber };

  const beefyVault = getContract({
    client: publicClient,
    abi: BeefyVaultAbi,
    address: vault.earnContractAddress,
  });

  const [beefyTotalSupply, wantTotalBalance, wantAddress, ...shareBalances] = await Promise.all([
    beefyVault.read.totalSupply(callParams),
    beefyVault.read.balance(callParams),
    beefyVault.read.want(callParams),
    ...users.map(user => beefyVault.read.balanceOf([user], callParams)),
  ]);

  const wantBalances = shareBalances.map(shareBalance =>
    beefyTotalSupply === 0n ? 0n : (shareBalance * wantTotalBalance) / beefyTotalSupply
  );
  defaultLogger.debug({
    beefyTotalSupply,
    wantTotalBalance,
    shareBalances,
    wantAddress,
    wantBalances,
  });
  return { wantAddress, wantTotalBalance, wantBalances };
}
