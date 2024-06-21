// chains.ts

import * as allChains from 'viem/chains';
import { Chain } from 'viem';

export const getAllChains = (): Chain[] => {
  const chains: Chain[] = [];

  for (const key in allChains) {
    const chain = (allChains as any)[key];
    if (chain && typeof chain === 'object' && 'id' in chain) {
      chains.push(chain as Chain);
    }
  }

  return chains;
};
