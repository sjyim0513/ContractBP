import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "scrollSepolia",
  networks: {
    hardhat: {},
    scrollSepolia: {
      url: `https://sepolia-rpc.scroll.io`
    },
    mainnet: {
      url: `https://sepolia-rpc.scroll.io`
    },
    base: {
      url: `https://sepolia-rpc.scroll.io`
    },
    arbitrum: {
      url: `https://sepolia-rpc.scroll.io`
    },
    zksyncera: {
      url: `https://sepolia-rpc.scroll.io`
    },
    blast: {
      url: `https://sepolia-rpc.scroll.io`
    },
  },
};

export default config;
