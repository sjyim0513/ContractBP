import { run } from "hardhat";
import fs from "fs";
import path from "path";
import { functionTemplates } from "./functionList";
import { StructField, GlobalVariable } from "./Interface";
//import IERC20 from './interfaces/';

const BASE_CONTRACT_TEMPLATE = `//SPDX-License-Identifier: LICENSE
pragma solidity ^VERSION;

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);
  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);
}

contract CONTRACTNAME {
  GLOBAL_VARIABLES

  // constructor() {
  //     INITIALIZATIONS
  // };

  FUNCTION_BODY
}
`;

function generateGlobalVariables(globals: GlobalVariable[]): string {
  //모든 타입에 대해서 정의해야함 그리고 json 보내면 만들어진 .sol 파일이랑 artifacts 폴더 삭제하게 만들기
  const mappings = globals.map((global) => {
    switch (global.type) {
      case "mapping":
        if (global.initValue == undefined) {
          return `mapping(${global.params.from} => ${global.params.to}) public ${global.name};`;
        }
        return `mapping(${global.params.from} => ${global.params.to}) public ${global.name};`;
      case "staticArray":
        console.log("왜? staticArray: ", global.params);
        if (global.initValue == undefined) {
          return `${global.params.type}[${global.params.length}] public ${global.name};`;
        }
        const staticInitList = global.initValue.join(", ");
        return `${global.params.type}[${global.params.length}] public ${global.name} = [${staticInitList}];`;
      case "dynamicArray":
        if (global.initValue == undefined) {
          return `${global.params.type}[] public ${global.name};`;
        }
        const dynamicInitList = global.initValue.join(", ");
        return `${global.params.type}[] public ${global.name} = [${dynamicInitList}];`;
      case "struct":
        const structFields = global
          .structFields!.map(
            (field: StructField) => `${field.type} ${field.name};`
          )
          .join(" ");
        return `struct ${global.name} { ${structFields} };`;
      default:
        if (global.initValue == undefined) {
          return `${global.type} public ${global.name};`;
        }
        return `${global.type} public ${global.name} = ${global.initValue};`;
    }
  });
  return mappings.join("\n  ");
}

function generateFunctionCode(
  name: string,
  params: { name: string; type: string }[],
  returnParams: { name: string; type: string }[]
): string {
  const template = functionTemplates[name];
  if (!template) {
    throw new Error(`Function template for ${name} not found`);
  }
  return template(params, returnParams);
}

async function generateAndCompileContract(
  license: string,
  version: string,
  contractName: string,
  globals: GlobalVariable[],
  functions: {
    [key: string]: {
      params: { name: string; type: string }[];
      return: { name: string; type: string }[];
    };
  }
) {
  //generate global variables
  const globalVariables = generateGlobalVariables(globals);
  //generate functions
  const functionCodes = Object.entries(functions).map(
    ([name, { params, return: returnParams }]) =>
      generateFunctionCode(name, params, returnParams)
  );
  const contractSource = BASE_CONTRACT_TEMPLATE.replace("LICENSE", license)
    .replace("VERSION", version)
    .replace("CONTRACTNAME", contractName)
    .replace("GLOBAL_VARIABLES", globalVariables)
    .replace("FUNCTION_BODY", functionCodes.join("\n  "));

  const contractPath = path.join(__dirname, `../contracts/${contractName}.sol`);
  fs.writeFileSync(contractPath, contractSource);

  await run("compile");

  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/${contractName}.sol/${contractName}.json`
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const solSource = fs.readFileSync(contractPath, "utf8");

  return {
    ...artifact,
    source: solSource,
  };
}

export { generateAndCompileContract };
