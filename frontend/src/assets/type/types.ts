interface License {
  name: string;
  identifier: string;
}

interface fun {
  name: string;
  params: { name: string; type: string }[];
  return: { name: string; type: string }[];
  var: { name: string; type: string }[];
}

interface global {
  name: string;
  type: string;
  param: {};
  initValue: any;
}

interface Store {
  license: String;
  version: string;
  contractName: string;
  functions: fun[];
  globals: global[];
}

export type { License, fun, global, Store };
