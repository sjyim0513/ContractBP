export interface StructField {
    name: string;
    type: string;
  }

export interface GlobalVariable {
    name: string;
    type: string;
    params: { from?: string; to?: string; type?: string; length?: string };
    arrayType?: string;
    structFields?: StructField[];
    initial?: any;
    initValue?: any | [];
  }