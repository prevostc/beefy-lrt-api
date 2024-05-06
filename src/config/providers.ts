import type { IProviderConstructor } from '../providers/types';
import { EtherFi } from '../providers/etherfi';
import { Renzo } from '../providers/renzo';
import { Kelp } from '../providers/kelp';
import { Vector } from '../providers/vector';
import { keys } from '../utils/object';

export type ProviderId = 'etherfi' | 'renzo' | 'kelp' | 'vector';

export const providers = {
  etherfi: EtherFi,
  renzo: Renzo,
  kelp: Kelp,
  vector: Vector,
} as const satisfies Record<ProviderId, IProviderConstructor>;

export const allProviderIds = keys(providers);
