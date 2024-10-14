import { License, fun, global, Store, Node, Edge } from "./type/types";

class BasicNode implements Node {
  id: string;
  type: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
  position: { x: number; y: number };

  constructor(id: string, type: string, position: { x: number; y: number }) {
    this.id = id;
    this.type = type;
    this.inputs = {};
    this.outputs = {};
    this.position = position;
  }
  process(): void {
    // 각 노드 타입에 따라 다른 처리를 수행
    console.log(`${this.type} 노드가 처리되었습니다.`);
  }
}

class Graph {
  nodes: { [id: string]: Node };
  edges: Edge[];

  constructor() {
    this.nodes = {};
    this.edges = [];
  }

  addNode(node: Node): void {
    this.nodes[node.id] = node;
  }

  connectNodes(edge: Edge): void {
    this.edges.push(edge);
  }

  processGraph(): void {
    // 모든 엣지를 순회하며 데이터를 전달
    for (const edge of this.edges) {
      const fromNode = this.nodes[edge.fromNodeId];
      const toNode = this.nodes[edge.toNodeId];

      // fromNode의 출력을 toNode의 입력으로 전달
      fromNode.process(); // 먼저 fromNode를 처리하여 출력값 생성
      toNode.inputs[edge.toPort] = fromNode.outputs[edge.fromPort]; // 출력 전달
    }

    // 모든 노드를 처리
    for (const nodeId in this.nodes) {
      const node = this.nodes[nodeId];
      node.process();
    }
  }
}

const graph = new Graph();

class ANode extends BasicNode {
  constructor(id: string, position: { x: number; y: number }) {
    super(id, "A", position);
  }

  process(): void {
    this.outputs["result"] = this.inputs["value"]; // 입력값을 그대로 출력
    console.log(`ANode ${this.id} 처리 결과: ${this.outputs["result"]}`);
  }
}

class BNode extends BasicNode {
  constructor(id: string, position: { x: number; y: number }) {
    super(id, "B", position);
  }

  process(): void {
    const input = this.inputs["value"];
    this.outputs["result"] = input * 2; // 입력값의 2배를 출력
    console.log(`BNode ${this.id} 처리 결과: ${this.outputs["result"]}`);
  }
}

class CNode extends BasicNode {
  constructor(id: string, position: { x: number; y: number }) {
    super(id, "C", position);
  }

  process(): void {
    const value = this.inputs["value"];
    console.log(`CNode ${this.id} 최종 출력 값: ${value}`);
  }
}

const aNode = new ANode("1", { x: 100, y: 100 });
aNode.inputs = { value: 10 }; // A 노드에 입력값 10 설정

const bNode = new BNode("2", { x: 200, y: 100 });
const cNode = new CNode("3", { x: 300, y: 100 });

// 그래프에 노드 추가
graph.addNode(aNode);
graph.addNode(bNode);
graph.addNode(cNode);

// 노드 연결: A 노드의 결과를 B 노드로 전달
graph.connectNodes({
  fromNodeId: "1",
  fromPort: "result",
  toNodeId: "2",
  toPort: "value",
});
// B 노드의 결과를 C 노드로 전달
graph.connectNodes({
  fromNodeId: "2",
  fromPort: "result",
  toNodeId: "3",
  toPort: "value",
});

// 그래프 처리
graph.processGraph();
