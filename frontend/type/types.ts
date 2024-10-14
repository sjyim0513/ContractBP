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

interface Node {
  id: string;
  type: string;
  inputs: { [key: string]: any }; // 입력 포트들
  outputs: { [key: string]: any }; // 출력 포트들
  position: { x: number; y: number }; // 화면 상의 위치

  process(): void;
}

interface Edge {
  fromNodeId: string; // 시작 노드 ID
  fromPort: string; // 시작 노드의 포트
  toNodeId: string; // 연결된 노드 ID
  toPort: string; // 연결된 노드의 포트
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export type { License, fun, global, Store, Node, Edge, Graph };
