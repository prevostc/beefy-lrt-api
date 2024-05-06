import type { IProvider, IProviderConstructor } from './types';
import type { ChainId } from '../config/chains';
import { type Address, type GetBlockReturnType, type PublicClient } from 'viem';
import type { Vault } from '../utils/vaults';
import { BaseProvider } from './base';
import type { PlatformBalance } from '../platforms/types';

const chainToToken: Partial<Record<ChainId, Address>> = {
  ethereum: '0x38D64ce1Bdf1A9f24E0Ec469C9cAde61236fB4a0',
};

class VectorProvider extends BaseProvider implements IProvider {
  private readonly vETH: Address;

  constructor(
    chainId: ChainId,
    publicClient: PublicClient,
    block: GetBlockReturnType,
    vaults: Vault[],
    users: Address[]
  ) {
    super('vector', ['vETH'], chainId, publicClient, block, vaults, users);

    const token = chainToToken[chainId];
    if (!token) {
      throw new Error(`${chainId} is not supported by ${this.id} provider`);
    }
    this.vETH = token;
  }

  protected get token(): Address {
    return this.vETH;
  }

  protected filterPlatformBalance(balance: PlatformBalance): boolean {
    return balance.token === this.vETH && balance.balance > 0;
  }
}

export const Vector = VectorProvider satisfies IProviderConstructor<VectorProvider>;
