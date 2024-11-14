import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "../frontend-schedules/artifacts",
  },

};

export default config;
