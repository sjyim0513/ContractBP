export const functionTemplates: { [key: string]: (params: {name: string, type: string}[], returnParams: {name: string, type: string}[]) => string } = {
    getTokenBalance: (params, returnParams) => {
        const paramList = params.map(param => `${param.type} ${param.name}`).join(", ");
      return `function getBalance(${paramList}) public view returns (${returnParams[0].type} ${returnParams[0].name}) {
            IERC20 token = IERC20(${params[0].name}); 
            return token.balanceOf(${params[1].name});
        }`;
    },
    setBalance: (params) => {
        //const paramList = params.map(param => `${param.type} ${param.name}`).join(", ");
        const paramList = params.map(param => `${param.type} ${param.name}`).join(", ");
        return `function setBalance(${paramList}) external {
            _balances[${params[0].name}] = ${params[1].name};
        }`;
      },
    getBalance: (params, returnParams) => {
        return `function getBalance (address ${params[0].name}) public view returns (${returnParams[0].type} ${returnParams[0].name}) {
            return _balances[${params[0].name}];
        }`
    },
    add: (params, returnParams) => {
        const paramList = params.map(param => `${param.type} ${param.name}`).join(", ");
        const sumExpression = params.map(param => `${param.name}`).join(" + ");
        return `function add(${paramList}) public pure returns (${returnParams[0].type} ${returnParams[0].name}) {
            return ${sumExpression};
        }`;
    },
    subtract: (params, returnParams) => {
        const paramList = params.map(param => `${param.type} ${param.name}`).join(", ");
        const subtractReturn = params.map(param => `${param.name}`).join(" - ");
        return `function add(${paramList}) public pure returns (${returnParams[0].type} ${returnParams[0].name}) {
            return ${subtractReturn};
        }`;
    },
    multiply: (params, returnParams) => {
        const paramList = params.map(param => `uint256 ${param}`).join(", ");
        const multiplyResult = params.join(" * ");
        return `function add(${paramList}) public pure returns (${returnParams[0].type} ${returnParams[0].name}) {
            return ${multiplyResult};
        }`;
    },
    //get Token Info
    getTokenInfo: (params, returnParams) => { //리턴값이 string, array, struct인 경우에는 return시 memory 추가해줘야함 -> 리텁값이 배열일 경우 무조건 type에 [] 달아주기
        const returnParamsList = returnParams.map(param => 
            (param.type === "string" || param.type.includes("[]") || param.type === "struct") 
            ? `${param.type} memory ${param.name}` 
            : `${param.type} ${param.name}`
        ).join(", ");
        return `function getTokenInfo(address ${params[0].name}) public view returns (${returnParamsList}) {
            IERC20 token = IERC20(${params[0].name});
            string memory tokenName = token.name();
            string memory tokenSymbol = token.symbol();
            uint8 tokenDecimals = token.decimals();
            return (tokenName, tokenSymbol, tokenDecimals);
        }`;
    },
  };
  