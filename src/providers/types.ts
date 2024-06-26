import type { ChainId } from '../config/chains';
import type { Address, GetBlockReturnType, PublicClient } from 'viem';
import type { Vault } from '../utils/vaults';
import type { ProviderId } from '../config/providers';

export type UserBalance = {
  address: Address;
  effective_balance: bigint;
};

export type VaultBalance = {
  id: string;
  total: bigint;
};

export type BalancesResponse = {
  result: UserBalance[];
  meta: {
    chainId: ChainId;
    providerId: ProviderId;
    block: { number: bigint; timestamp: bigint };
    token: Address;
    vaults: VaultBalance[];
  };
};

export interface IProvider {
  readonly id: string;

  getBalances(): Promise<BalancesResponse>;
}

export interface IProviderConstructor<T extends IProvider = IProvider> {
  new (
    chainId: ChainId,
    publicClient: PublicClient,
    block: GetBlockReturnType,
    vaults: Vault[],
    users: Address[]
  ): T;
}
