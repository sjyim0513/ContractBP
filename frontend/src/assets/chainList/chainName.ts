import { defineChain } from '../../../node_modules/viem/utils/chain/defineChain.js'

export const subChainList = {
    '97072271': defineChain({
        id: 97072271,
        name: 'Prom testnet',
        nativeCurrency: {
          decimals: 18,
          name: 'PROM',
          symbol: 'PROM',
        },
        rpcUrls: {
          default: { http: ['https://testnet-rpc.prom.io'] },
        },
        blockExplorers: {
          default: {
            name: 'Prom Testnet Explorer',
            url: 'https://testnet.promscan.io',
            apiUrl: 'https://testnet.promscan.io/api',
          },
        },
        contracts: {
          multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 4584012,
          },
        },
        testnet: true,
      }),
    '9789': defineChain({
        id: 9789,
        name: 'Tabi Testnet',
        nativeCurrency: {
            decimals: 18,
            name: 'TABI',
            symbol: 'TABI',
        },
        rpcUrls: {
            default: { http: ['https://rpc.testnet.tabichain.com'] },
        },
        blockExplorers: {
            default: {
            name: 'Tabi Testnet explorer',
            url: 'https://testnet-api2.tabiscan.com',
            apiUrl: 'https://testnet-api2.tabiscan.com/api',
            },
        },
        contracts: {
            multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 4584012,
            },
        },
        testnet: true,
        }),
  };