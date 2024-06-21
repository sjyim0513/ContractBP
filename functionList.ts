interface ContractFunction {
    name: string;
    params: { name: string, type: string }[];
  }
  
  const availableFunctions: ContractFunction[] = [
    {
      name: 'getBalance',
      params: [{ name: 'address', type: 'address' }]
    },
    {
      name: 'setBalance',
      params: [
        { name: 'address', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ]
    },
    {
      name: 'add',
      params: [
        { name: 'a', type: 'uint256' },
        { name: 'b', type: 'uint256' }
      ]
    },
    {
        name: 'subtract',
        params: [
          { name: 'a', type: 'uint256' },
          { name: 'b', type: 'uint256' }
        ]
      },
      {
        name: 'multiply',
        params: [
            { name: 'a', type: 'uint256'},
            { name: 'b', type: 'uint256'}
        ]
      }

    // 필요한 함수들을 추가합니다.
  ];
  