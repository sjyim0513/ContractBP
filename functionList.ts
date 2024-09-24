import { fun } from "./frontend/src/assets/type/types";

const functionList: fun[] = [
  {
    name: "getBalance",
    params: [{ name: "address", type: "address" }],
    return: [],
  },
  {
    name: "setBalance",
    params: [
      { name: "address", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    return: [],
  },
  {
    name: "add",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
    return: [],
  },
  {
    name: "subtract",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
    return: [],
  },
  {
    name: "multiply",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
    return: [],
  },
  {
    name: "getTokenInfo",
    params: [{ name: "tokenAddress", type: "address" }],
    return: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
    ],
  },
];

export type { functionList };
