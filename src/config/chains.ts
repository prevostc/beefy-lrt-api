import type { Chain as ViemChain, MulticallBatchOptions } from 'viem';
import { arbitrum, base, linea, mainnet, optimism, type Prettify } from 'viem/chains';
import { keyBy } from 'lodash';
import { getRequiredStringEnv } from '../utils/env';
import { keys } from '../utils/object';
import type { ProviderId } from './providers';

export type Chain<T extends string = string> = {
  id: T;
  name: string;
  viem: ViemChain;
  batch?: boolean | MulticallBatchOptions | undefined;
  multicall?: boolean | Prettify<MulticallBatchOptions> | undefined;
  rpc: string;
  providers: Partial<Record<ProviderId, string[]>>;
};

function toChainMap<T extends ReadonlyArray<Chain>>(arr: T) {
  return keyBy(arr, 'id') as { [K in T[number]['id']]: Extract<T[number], { id: K }> };
}

const renzo = ['ezETH'];
const etherfi = ['eETH', 'weETH'];
const kelp = ['rsETH', 'wrsETH'];
const vector = ['vETH'];

export const chains = toChainMap([
  {
    id: 'ethereum',
    name: 'Ethereum',
    viem: mainnet,
    rpc: getRequiredStringEnv('ETHEREUM_RPC'),
    providers: { renzo, etherfi, vector },
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    viem: arbitrum,
    rpc: getRequiredStringEnv('ARBITRUM_RPC'),
    providers: { renzo, etherfi, kelp },
  },
  {
    id: 'linea',
    name: 'Linea',
    viem: linea,
    rpc: getRequiredStringEnv('LINEA_RPC'),
    providers: { renzo, etherfi },
  },
  {
    id: 'base',
    name: 'Base',
    viem: base,
    rpc: getRequiredStringEnv('BASE_RPC'),
    providers: { renzo, etherfi, kelp },
  },
  {
    id: 'optimism',
    name: 'Optimism',
    viem: optimism,
    rpc: getRequiredStringEnv('OPTIMISM_RPC'),
    providers: { kelp },
  },
] as const satisfies ReadonlyArray<Chain>);

export type Chains = typeof chains;
export type ChainId = keyof Chains;

export const allChainIds = keys(chains);

export function getChain<T extends ChainId = ChainId>(id: T): Chain<T> {
  if (id in chains) {
    return chains[id];
  }
  throw new Error(`Unknown chain: ${id}`);
}

export function getChainOrUndefined<T extends ChainId = ChainId>(id: T): Chain<T> | undefined {
  if (id in chains) {
    return chains[id];
  }
  return undefined;
}

export function getChainsByProvider(provider: ProviderId): Chain<ChainId>[] {
  return allChainIds.filter(chainId => provider in chains[chainId].providers).map(getChain);
}
