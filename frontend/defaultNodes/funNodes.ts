import { Node } from "../type/types";

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
  process(): void {}
}

class BNode extends BasicNode {
  constructor(id: string, position: { x: number; y: number }) {
    super(id, "B", position);
  }

  process(): void {
    const input = this.inputs["value"];
    this.outputs["result"] = input * 2;
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
