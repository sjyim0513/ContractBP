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

//Logic
class if_Node extends BasicNode {
  constructor(id: string, type: string, position: { x: number; y: number }) {
    super(id, type, position);
  }

  process(): void {
    this.outputs[0] = this.inputs["value"];
  }
}

class while_Node extends BasicNode {}

class for_Node extends BasicNode {}

class switch_Node extends BasicNode {}

//Math
class add_Node extends BasicNode {}

class minus_Node extends BasicNode {}

class multi_Node extends BasicNode {}

class sub_Node extends BasicNode {}

class remain_Node extends BasicNode {}

class increase_Node extends BasicNode {}

class decrease_Node extends BasicNode {}

//Logic

class and_Node extends BasicNode {}

class or_Node extends BasicNode {}

class not_Node extends BasicNode {}

class nand_Node extends BasicNode {}

class is_Node extends BasicNode {}
