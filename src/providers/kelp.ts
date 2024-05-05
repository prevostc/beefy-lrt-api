import type { IProvider, IProviderConstructor } from './types';
import type { ChainId } from '../config/chains';
import { type Address, type GetBlockReturnType, type PublicClient } from 'viem';
import type { Vault } from '../utils/vaults';
import { BaseProvider } from './base';
import type { PlatformBalance } from '../platforms/types';

const chainToToken: Partial<Record<ChainId, Address>> = {
  optimism: '0x87eEE96D50Fb761AD85B1c982d28A042169d61b1',
  arbitrum: '0x4186BFC76E2E237523CBC30FD220FE055156b41F',
  base: '0xEDfa23602D0EC14714057867A78d01e94176BEA0',
};

class KelpProvider extends BaseProvider implements IProvider {
  private readonly rsETH: Address;

  constructor(
    chainId: ChainId,
    publicClient: PublicClient,
    block: GetBlockReturnType,
    vaults: Vault[],
    users: Address[]
  ) {
    super('renzo', ['wrsETH', 'rsETH'], chainId, publicClient, block, vaults, users);

    const token = chainToToken[chainId];
    if (!token) {
      throw new Error(`${chainId} is not supported by ${this.id} provider`);
    }
    this.rsETH = token;
  }

  protected get token(): Address {
    return this.rsETH;
  }

  protected filterPlatformBalance(balance: PlatformBalance): boolean {
    return balance.token === this.rsETH && balance.balance > 0;
  }
}

export const Kelp = KelpProvider satisfies IProviderConstructor<KelpProvider>;
