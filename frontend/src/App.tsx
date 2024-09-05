import React, { useEffect, useState } from 'react';
import 'viem/window';
import { createPublicClient, createWalletClient, custom, Chain, defineChain } from 'viem';
import testJSON from '../../example.json';
import { getAllChains } from './assets/chainList/allChains.ts';

import BPbase from './assets/Main/main.tsx'

import classes from "./assets/ssSwap.module.css";

import { Button, Dialog, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import {Search} from "@mui/icons-material";

const CUSTOM_CHAINS_KEY = 'customChains';

const saveCustomChains = (chains: Chain[]) => {
  localStorage.setItem(CUSTOM_CHAINS_KEY, JSON.stringify(chains));
};

const deleteCustomChain = (chainId: number | string) => {
  const customChains = loadCustomChains();
  const updatedChains = customChains.filter(chain => chain.id !== chainId);
  saveCustomChains(updatedChains);
};

// Function to load custom chains from local storage
const loadCustomChains = (): Chain[] => {
  const storedChains = localStorage.getItem('customChains');
  return storedChains ? JSON.parse(storedChains) : [];
};

// Function to merge custom chains with default chains
const getMergedChains = (): Chain[] => {
  const customChains = loadCustomChains();
  const defaultChains = getAllChains();
  return [...customChains, ...defaultChains];
};


async function connectWallet(): Promise<string | undefined> {
  if (!window.ethereum) {
    console.error('Metamask not found');
    return;
  }
  try {
    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    console.log('Connected account:', account);
    return account;
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}

async function getCurrentChain(): Promise<Chain | undefined> {
  if (!window.ethereum) {
    console.error('MetaMask not found');
    return;
  }
  try {
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16); // 16진수를 10진수로 변환
    let chain = getMergedChains().find(c => c.id === chainId);
    //이거 없을때 추가하라고 하든 해야할 듯
    return chain;
  } catch (error) {
    console.error('Error getting current chain:', error);
  }
}

async function setWalletChain(chain: Chain) {
  const walletConnect = createWalletClient({
    chain: chain,
    transport: custom(window.ethereum!)
  });
  try {
    await walletConnect.switchChain({ id: chain.id });
    return chain;
  } catch (error: any) {
    if (error.name === "SwitchChainError") {
      try {
        await walletConnect.addChain({ chain: chain });
        return chain;
      } catch (error: any) {
        console.error("Chain adding failed: ", error.name);
      }
    } else {
      console.error("Chain switching failed: ", error.name);
    }
  }
}

async function deployContract(account: string, chain: Chain, abi: any, bytecode: any) {
  const client = createPublicClient({
    chain: chain,
    transport: custom(window.ethereum!)
  });

  const walletConnect = createWalletClient({
    chain: chain,
    transport: custom(window.ethereum!)
  });

  try {
    const [accountData] = await walletConnect.getAddresses();
    const deployTx = await walletConnect.deployContract({
      abi,
      account: accountData,
      bytecode,
      args: []
    });

    const receipt = await client.waitForTransactionReceipt({ hash: deployTx });
    console.log('Contract deployed at address:', receipt.contractAddress);
    return receipt.contractAddress;
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

//누나용
function Daegin({}) {
  const finals = [
    { x :560, y: 400, name: "" },
    { x :560, y: 650, name: "" },
  ];
  
  const line1_16 = [
    { x: 50, y: 50, name: "" },
    { x: 50, y: 100, name: "" },
    { x: 50, y: 150, name: "" },
    { x: 50, y: 200, name: "" },
    { x: 50, y: 250, name: "" },
    { x: 50, y: 300, name: "" },
    { x: 50, y: 350, name: "" },
    { x: 50, y: 400, name: "" },
    { x: 1067, y: 50, name: "" },
    { x: 1067, y: 100, name: "" },
    { x: 1067, y: 150, name: "" },
    { x: 1067, y: 200, name: "" },
    { x: 1067, y: 250, name: "" },
    { x: 1067, y: 300, name: "" },
    { x: 1067, y: 350, name: "" },
    { x: 1067, y: 400, name: "" },
  ]

  const line1_8 = [
    { x: 200, y: 75, name: "" },
    { x: 200, y: 175, name: "" },
    { x: 200, y: 275, name: "" },
    { x: 200, y: 375, name: "" },
    { x: 917, y: 75, name: "" },
    { x: 917, y: 175, name: "" },
    { x: 917, y: 275, name: "" },
    { x: 917, y: 375, name: "" },
  ]

  const line1_4 = [
    { x: 350, y: 125, name: "" },
    { x: 350, y: 325, name: "" },
    { x: 767, y: 125, name: "" },
    { x: 767, y: 325, name: "" },
  ]

  const semifinal1 = [
    { x: 500, y: 225, name: "" },
    { x: 617, y: 225, name: "" },
  ]

  const line2_16 = [
    { x: 50, y: 650, name: "" },
    { x: 50, y: 700, name: "" },
    { x: 50, y: 750, name: "" },
    { x: 50, y: 800, name: "" },
    { x: 50, y: 850, name: "" },
    { x: 50, y: 900, name: "" },
    { x: 50, y: 950, name: "" },
    { x: 50, y: 1000, name: "" },
    { x: 1067, y: 650, name: "" },
    { x: 1067, y: 700, name: "" },
    { x: 1067, y: 750, name: "" },
    { x: 1067, y: 800, name: "" },
    { x: 1067, y: 850, name: "" },
    { x: 1067, y: 900, name: "" },
    { x: 1067, y: 950, name: "" },
    { x: 1067, y: 1000, name: "" },
  ]

  const line2_8 = [
    { x: 200, y: 675, name: "" },
    { x: 200, y: 775, name: "" },
    { x: 200, y: 875, name: "" },
    { x: 200, y: 975, name: "" },
    { x: 917, y: 675, name: "" },
    { x: 917, y: 775, name: "" },
    { x: 917, y: 875, name: "" },
    { x: 917, y: 975, name: "" },
  ]

  const line2_4 = [
    { x: 350, y: 725, name: "" },
    { x: 350, y: 925, name: "" },
    { x: 767, y: 725, name: "" },
    { x: 767, y: 925, name: "" },
  ]

  const semifinal2 = [
    { x: 500, y: 825, name: "" },
    { x: 617, y: 825, name: "" },
  ]

  const testlist = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12","13", "14", "15", "16", "17", "18", "19", "20", "21"] //이거를 백엔드에서 받아오는걸로+

  if(testlist.length > 2) {
    if(testlist.length > 4) {
      if(testlist.length > 8) {
        if(testlist.length > 16) {
          let testIndex = 0;
  
          const halflength = Math.floor(testlist.length / 2)
          const firstHalf = testlist.slice(0, halflength);
          const secondHalf = testlist.slice(halflength);
          
          for (let i = 0; i < line1_16.length; i += 2) {
            if (testIndex < firstHalf.length) {
                line1_16[i].name = firstHalf[testIndex];
                testIndex++;
            }
          }
  
          for (let i = 1; i < line1_16.length; i += 2) {
              if (testIndex < firstHalf.length) {
                  line1_16[i].name = firstHalf[testIndex];
                  testIndex++;
              }
          }
          testIndex = 0;
          for (let i = 0; i < line2_16.length; i += 2) {
            if (testIndex < secondHalf.length) {
              line2_16[i].name = secondHalf[testIndex];
                testIndex++;
            }
          }
  
          for (let i = 1; i < line2_16.length; i += 2) {
              if (testIndex < secondHalf.length) {
                line2_16[i].name = secondHalf[testIndex];
                  testIndex++;
              }
          }
          
        }
        else {
          let testIndex = 0;
  
          for (let i = 0; i < line1_16.length; i += 2) {
            if (testIndex < testlist.length) {
                line1_16[i].name = testlist[testIndex];
                testIndex++;
            }
          }
  
          for (let i = 1; i < line1_16.length; i += 2) {
              if (testIndex < testlist.length) {
                  line1_16[i].name = testlist[testIndex];
                  testIndex++;
              }
          }
          
        }
      }
      else {
          let testIndex = 0;
  
          for (let i = 0; i < line1_16.length/2; i += 2) {
            if (testIndex < testlist.length) {
              line1_16[i].name = testlist[testIndex];
                testIndex++;
            }
          }
          
          for (let i = 1; i < line1_16.length/2; i += 2) {
              if (testIndex < testlist.length) {
                line1_16[i].name = testlist[testIndex];
                  testIndex++;
              }
          }
      }
    }
    else {
      let testIndex = 0;
  
      for (let i = 0; i < line1_8.length/2; i += 2) {
        if (testIndex < testlist.length) {
          line1_8[i].name = testlist[testIndex];
            testIndex++;
        }
      }
      
      for (let i = 1; i < line1_8.length/2; i += 2) {
          if (testIndex < testlist.length) {
            line1_8[i].name = testlist[testIndex];
              testIndex++;
          }
      }
    }
  }
  else {
    let testIndex = 0;
  
      for (let i = 0; i < line1_4.length/2; i += 2) {
        if (testIndex < testlist.length) {
          line1_4[i].name = testlist[testIndex];
            testIndex++;
        }
      }
      
      for (let i = 1; i < line1_4.length/2; i += 2) {
          if (testIndex < testlist.length) {
            line1_4[i].name = testlist[testIndex];
              testIndex++;
          }
      }
  }
  

  // const mappedTeams = mapTeamsToSVG(items);

  // const staticTeams = [
  //     // 좌측 팀
  //     ...Array(8).fill().map((_, i) => ({ x: 50, y: 50 + i * 50, name: `팀 ${i + 1}` })), //8강
  //     // 우측 팀
  //     ...Array(8).fill().map((_, i) => ({ x: 1067, y: 50 + i * 50, name: `팀 ${i + 9}` })), //4강
  //     // 좌측 하단 팀
  //     ...Array(8).fill().map((_, i) => ({ x: 50, y: 650 + i * 50, name: `팀 ${i + 17}` })),
  //     // 우측 하단 팀
  //     ...Array(8).fill().map((_, i) => ({ x: 1067, y: 650 + i * 50, name: `팀 ${i + 25}` })),
  // ];

  // const winners = [
  //     // 2차전 승자
  //     ...Array(4).fill().map((_, i) => ({ x: 200, y: 75 + i * 100, name: `승자 ${i + 1}` })),
  //     ...Array(4).fill().map((_, i) => ({ x: 200, y: 675 + i * 100, name: `승자 ${i + 5}` })),
  //     // 3차전 승자
  //     ...Array(2).fill().map((_, i) => ({ x: 350, y: 125 + i * 200, name: `승자 ${i + 9}` })),
  //     ...Array(2).fill().map((_, i) => ({ x: 350, y: 725 + i * 200, name: `승자 ${i + 11}` })),
  //     // 우측 2차전 승자
  //     ...Array(4).fill().map((_, i) => ({ x: 917, y: 75 + i * 100, name: `승자 ${i + 13}` })),
  //     ...Array(4).fill().map((_, i) => ({ x: 917, y: 675 + i * 100, name: `승자 ${i + 17}` })),
  //     // 우측 3차전 승자
  //     ...Array(2).fill().map((_, i) => ({ x: 767, y: 125 + i * 200, name: `승자 ${i + 21}` })),
  //     ...Array(2).fill().map((_, i) => ({ x: 767, y: 725 + i * 200, name: `승자 ${i + 23}` })),
  // ];


  const generateLines = () => {
      const lines = [];
      // 좌상단 1차전 -> 2차전 선들
      for (let i = 0; i < 4; i++) {
          lines.push(`150,${65 + i * 100} 175,${65 + i * 100} 175,${90 + i * 100} 200,${90 + i * 100}`);
          lines.push(`150,${115 + i * 100} 175,${115 + i * 100} 175,${90 + i * 100} 200,${90 + i * 100}`);
      }
      // 좌상단 2차전 -> 3차전 선들
      for (let i = 0; i < 2; i++) {
          lines.push(`300,${90 + i * 200} 325,${90 + i * 200} 325,${140 + i * 200} 350,${140 + i * 200}`);
          lines.push(`300,${190 + i * 200} 325,${190 + i * 200} 325,${140 + i * 200} 350,${140 + i * 200}`);
      }
      // 좌상단 3차전 -> 준결승 선들
      lines.push("450,140 475,140 475,240 500,240");
      lines.push("450,340 475,340 475,240 500,240");

      // 우상단 선들 (대칭)
      for (let i = 0; i < 4; i++) {
          lines.push(`1067,${65 + i * 100} 1042,${65 + i * 100} 1042,${90 + i * 100} 1017,${90 + i * 100}`);
          lines.push(`1067,${115 + i * 100} 1042,${115 + i * 100} 1042,${90 + i * 100} 1017,${90 + i * 100}`);
      }
      for (let i = 0; i < 2; i++) {
          lines.push(`917,${90 + i * 200} 892,${90 + i * 200} 892,${140 + i * 200} 867,${140 + i * 200}`);
          lines.push(`917,${190 + i * 200} 892,${190 + i * 200} 892,${140 + i * 200} 867,${140 + i * 200}`);
      }
      lines.push("767,140 742,140 742,240 717,240");
      lines.push("767,340 742,340 742,240 717,240");

      // 하단 부분 선들 (위와 유사하지만 y 좌표 600 증가)
      // 좌하단 1차전 -> 2차전 선들
      for (let i = 0; i < 4; i++) {
          lines.push(`150,${665 + i * 100} 175,${665 + i * 100} 175,${690 + i * 100} 200,${690 + i * 100}`);
          lines.push(`150,${715 + i * 100} 175,${715 + i * 100} 175,${690 + i * 100} 200,${690 + i * 100}`);
      }
      // 좌하단 2차전 -> 3차전 선들
      for (let i = 0; i < 2; i++) {
          lines.push(`300,${690 + i * 200} 325,${690 + i * 200} 325,${740 + i * 200} 350,${740 + i * 200}`);
          lines.push(`300,${790 + i * 200} 325,${790 + i * 200} 325,${740 + i * 200} 350,${740 + i * 200}`);
      }
      // 좌하단 3차전 -> 준결승 선들
      lines.push("450,740 475,740 475,840 500,840");
      lines.push("450,940 475,940 475,840 500,840");

      // 우하단 선들 (대칭)
      for (let i = 0; i < 4; i++) {
          lines.push(`1067,${665 + i * 100} 1042,${665 + i * 100} 1042,${690 + i * 100} 1017,${690 + i * 100}`);
          lines.push(`1067,${715 + i * 100} 1042,${715 + i * 100} 1042,${690 + i * 100} 1017,${690 + i * 100}`);
      }
      for (let i = 0; i < 2; i++) {
          lines.push(`917,${690 + i * 200} 892,${690 + i * 200} 892,${740 + i * 200} 867,${740 + i * 200}`);
          lines.push(`917,${790 + i * 200} 892,${790 + i * 200} 892,${740 + i * 200} 867,${740 + i * 200}`);
      }
      lines.push("767,740 742,740 742,840 717,840");
      lines.push("767,940 742,940 742,840 717,840");
      // 중앙 결승전 선들
      lines.push("600,240 617,240", "600,840 617,840", "608,240 608,840");

      return lines;
  };

  const lines = generateLines();

  const renderRect = (item, index) => (
      <g key={index}>
          <rect x={item.x} y={item.y} width="100" height="30" fill="lightgray" />
          <text x={item.x + 50} y={item.y + 20} fill="black" textAnchor="middle">{item.name}</text>
      </g>
  );

  return (
      <svg
          width="80%"
          height="80%"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
      >
          {lines.map((points, index) => (
              <polyline key={index} points={points} stroke="black" fill="none" />
          ))}
          {semifinal1.map(renderRect)}
          {line1_4.map(renderRect)}
          {line1_8.map(renderRect)}
          {line1_16.map(renderRect)}
          {semifinal2.map(renderRect)}
          {line2_4.map(renderRect)}
          {line2_8.map(renderRect)}
          {line2_16.map(renderRect)}
          {finals.map(renderRect)}
          {/* <g>
              <rect x="560" y="400" width="100" height="30" fill="lightgray" />
              <text x="610" y="420" fill="black" textAnchor="middle">팀 32</text>
          </g>
          <g>
              <rect x="560" y="650" width="100" height="30" fill="lightgray" />
              <text x="610" y="670" fill="black" textAnchor="middle">팀 33</text>
          </g> */}
          <g>
              <rect x="567" y="525" width="80" height="30" fill="white" />
              <text x="607" y="545" fill="black" fontSize="20" textAnchor="middle">VS</text>
          </g>
      </svg>
  );
}

function AssetSelect({ value, assetOptions, onSelect }) {
  const [open, setOpen] = useState(false);
  const [addCustomOpen, setAddCustomOpen] = useState(false);
  const [delCustomOpen, setDeleteCustomOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredAssetOptions, setFilteredAssetOptions] = useState<Chain[]>([]);
  const [networkName, setNetworkName] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [blockExplorerUrl, setBlockExplorerUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openSearch = () => {
    setSearch("");
    setOpen(true);
  };

  useEffect(() => {
    async function sync() {
      const ao = assetOptions.filter((asset: Chain) => {
        if (search && search !== "") {
          if (!isNaN(Number(search))) {
            return asset.id.toString().includes(search);
          } else {
            return asset.name.toLowerCase().includes(search.toLowerCase());
          }
        } else {
          return true;
        }
      });
      setFilteredAssetOptions(ao);
    }
    sync();
  }, [assetOptions, search]);

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const setSelectedChain = (asset: Chain) => {
    setSearch("");
    setOpen(false);
    onSelect(asset);
  };

  const addCustomChain = () => {
    setAddCustomOpen(true);
    //setOpen(false);
  };

  const delCustomChain = () => {
    setDeleteCustomOpen(true);
    //setOpen(false);
  };

  const onClose = () => {
    setSearch("");
    setOpen(false);
    setAddCustomOpen(false);
    setError(null);
  };

  const onCloseAddCustomChain = () => {
    setAddCustomOpen(false)
    setDeleteCustomOpen(false)
  }

  const handleAddCustomChain = () => {
    const customChains = loadCustomChains();
    const chainExists = customChains.some(chain => chain.id === Number(chainId));

    if (chainExists) {
      setError("This chain ID already exists.");
      return;
    }

    const newChain: Chain = defineChain({
      id: Number(chainId),
      name: networkName,
      network: networkName.toLowerCase(),
      nativeCurrency: {
        name: currencySymbol,
        symbol: currencySymbol,
        decimals: 18
      },
      rpcUrls: {
        default: {
          http: [rpcUrl],
          webSocket: undefined
        }
      },
      blockExplorers: {
        default: {
          name: 'Block Explorer',
          url: blockExplorerUrl,
        },
      },
      testnet: false
    });

    console.log("newChain", newChain)

    //const customChains = loadCustomChains();
    //saveCustomChains([...customChains, newChain]);
    saveCustomChains([...customChains, newChain]);

    setNetworkName("");
    setChainId("");
    setRpcUrl("");
    setCurrencySymbol("")
    setBlockExplorerUrl("")
    setAddCustomOpen(false);
    setFilteredAssetOptions([newChain, ...assetOptions]);
  };

  const handleDeleteCustomChain = (chainId: number | string) => {
    deleteCustomChain(chainId);
    const updatedAssetOptions = getMergedChains();
    setFilteredAssetOptions(updatedAssetOptions);
    if (value && value.id === chainId) {
      onSelect(undefined); // 선택된 체인이 삭제된 경우 초기화
    }
  };

  const deleteChain = (asset: any, idx: number) => {
    return (
      <MenuItem
      key={idx}
      className={classes.assetSelectMenu}
      style={{display: "flex", justifyContent: "space-between" }}
    >
      <div>
        <Typography variant="inherit" style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}>
          {asset.name}
        </Typography>
        <Typography variant="subtitle1" style={{ fontSize: "13px" }} color="textSecondary">
          {asset.network}
        </Typography>
        <Typography variant="inherit" style={{ fontWeight: "500", fontSize: "13px" }}>
          {asset.id}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: "12px" }}>
          ChainID
        </Typography>
      </div>
      <Button
        onClick={() => handleDeleteCustomChain(asset.id)} color="secondary" variant="contained" style={{ marginLeft: 25 }}
       >
        Delete
      </Button>
    </MenuItem>
    )
  }

  const renderAssetOption = (asset: any, idx: number) => {
    // if (asset.id === 0) {
    //   return (
    //     <div
    //       className={classes.addCustomChainButtons}
    //     >
    //       <Button
    //         onClick={addCustomChain}
    //         color="primary" variant="contained" style={{ marginTop: 1}}
    //       >
    //         Add
    //       </Button>
    //       <Button
    //         onClick={delCustomChain}
    //         color="secondary" variant="contained" style={{ marginTop: 1, marginLeft: 10 }}
    //       >
    //         Manage
    //       </Button>
    //     </div>
    //   );
    // }
    return (
      <MenuItem
        key={idx}
        className={classes.assetSelectMenu}
        onClick={() => setSelectedChain(asset)}
        style={{ margin: "1px 0" }}
      >
        <div>
          <Typography variant="inherit" style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}>
            {asset.name}
          </Typography>
          <Typography variant="subtitle1" style={{ fontSize: "13px" }} color="textSecondary">
            {asset.network}
          </Typography>
        </div>
        <div className={classes.assetSelectBalance}>
          <Typography variant="inherit" style={{ fontWeight: "500", fontSize: "13px" }}>
            {asset.id}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: "12px" }}>
            ChainID
          </Typography>
        </div>
      </MenuItem>
    );
  };

  const renderOptions = () => {
    return (
      <>
        <div className={classes.searchContainer}>
          <div className={classes.searchInline}>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              placeholder="Search..."
              value={search}
              onChange={onSearchChanged}
              autoComplete="off"
              sx={{ '& .MuiInputBase-root': { height: '35px' }, input: { color: "#000000" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
          className={classes.addCustomChainButtons}
        >
          <Button
            onClick={addCustomChain}
            color="primary" variant="contained" style={{ marginTop: 1}}
          >
            Add
          </Button>
          <Button
            onClick={delCustomChain}
            color="secondary" variant="contained" style={{ marginTop: 1, marginLeft: 10 }}
          >
            Manage
          </Button>
        </div>
          <div className={classes.assetSearchResults}>
            {filteredAssetOptions && filteredAssetOptions.length > 0 ? (
              filteredAssetOptions.map(renderAssetOption)
            ) : (
              <div>
                <Typography>No results</Typography>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderDeleteCustomOptions = () => {
    const customChains = loadCustomChains()
    return (
      <>
        <div className={classes.addCustomChain}>
          <Typography variant="h6">Delete Custom Chain
            <div className={classes.searchContainer}>
              <div>
                {customChains && customChains.length > 0 ? (
                  customChains.map(deleteChain)
                ) : (
                  <div>
                    <Typography>No results</Typography>
                  </div>
                )}
              </div>
              <Button onClick={handleAddCustomChain} color="primary" variant="contained" style={{ marginTop: 20 }}>
                Save
              </Button>
              <Button onClick={onCloseAddCustomChain} color="secondary" variant="contained" style={{ marginTop: 20, marginLeft: 10 }}>
                Close
              </Button>
            </div>
          </Typography>
        </div>
      </>
    );
  };

  const renderCustomChainForm = () => {
    return (
      <div style={{ padding: 20, maxWidth: 300 }}>
        <Typography variant="h6">Add Custom Chain</Typography>
        {error && (
          <Typography variant="body2" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Network Name"
          value={networkName}
          onChange={(e) => setNetworkName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chain ID"
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="RPC URL"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Currency symbol"
          value={currencySymbol}
          onChange={(e) => setCurrencySymbol(e.target.value)}
          fullWidth
          margin="normal"
        />
         <TextField
          label="Block Explorer"
          value={blockExplorerUrl}
          onChange={(e) => setBlockExplorerUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleAddCustomChain} color="primary" variant="contained" style={{ marginTop: 20 }}>
          Save
        </Button>
        <Button onClick={onCloseAddCustomChain} color="secondary" variant="contained" style={{ marginTop: 20, marginLeft: 10 }}>
          Close
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={classes.displaySelectContainer} onClick={openSearch}>
        <div className={classes.assetSelectMenuItem}>
          <div className={classes.displayDualIconContainer}>
            <div className={classes.assetTypo} style={{ color: "black", boxShadow: "rgba 34, 34, 34, 0.02 0px 0px 1px 0px", fontWeight: "500", display: "flex", alignItems: "center" }}>
              {value?.name}
              <div style={{ padding: "7px" }}>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
        {renderOptions()}
      </Dialog>
      <Dialog onClose={onCloseAddCustomChain} aria-labelledby="simple-dialog-title" open={addCustomOpen}>
        {renderCustomChainForm()}
      </Dialog>
      <Dialog onClose={onCloseAddCustomChain} aria-labelledby="simple-dialog-title" open={delCustomOpen}>
        {renderDeleteCustomOptions()}
      </Dialog>
    </React.Fragment>
  );
}

const App: React.FC = () => {
  const [account, setAccount] = useState<string | undefined>();
  const [sourceCode, setSourceCode] = useState<string>();
  const [abi, setABI] = useState<string>();
  const [bytecode, setByteCode] = useState<string>();
  const [contractAddress, setContractAddress] = useState<string>();
  const [currentChain, setCurrentChain] = useState<Chain | undefined>();
  const [forceRender, setForceRender] = useState<boolean>(false); // 강제 리렌더링 상태

  const fetchChain = async () => {
    const getWalletChain = await getCurrentChain();
    setCurrentChain(getWalletChain);
  };

  const forceUpdate = () => setForceRender(prev => !prev); // 강제 리렌더링 함수

  useEffect(() => {
    fetchChain();

    const handleChainChanged = async (chainId: string) => {
      console.log("체인 변경: ", chainId);
      await fetchChain();
      forceUpdate(); // 체인이 변경될 때 강제 리렌더링
    };

    const change = async () => {
      const result = await window.ethereum?.on('chainChanged', handleChainChanged);
      await fetchChain();
      forceUpdate();
      console.log('결과: ', result)
    }

    if (window.ethereum) {
      console.log("메마 있음")
      change()
      console.log("chainChanged listener added");

      window.ethereum.on('connect', (info: { chainId: string }) => {
        console.log("Connected to network:", info.chainId);
      });

      window.ethereum.on('disconnect', (error: { code: number; message: string }) => {
        console.log("Disconnected from network:", error);
      });
    } else {
      console.log("window.ethereum is not available");
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleSendData = async () => {
    try {
      const response = await fetch('http://localhost:3000/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testJSON)
      });

      const result = await response.json();
      setSourceCode(result.source);
      setABI(result.abi);
      setByteCode(result.bytecode);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleConnectWallet = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  };

  const handleDeployContract = async () => {
    if (account && currentChain) {
      const ca = await deployContract(account, currentChain, abi, bytecode);
      setContractAddress(`${ca}`);
    }
  };

  const onChainSelect = async (chain: Chain) => {
    if (currentChain?.id === chain.id) {
      return;
    }
    const result = await setWalletChain(chain);
    if(result) {
      setCurrentChain(chain);
    }
  };

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean }>({ x: 0, y: 0, show: false });

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      show: true
    });
  };
  
  const handleClick = () => {
    // Hide the context menu when clicking anywhere else
    if (contextMenu.show) {
      setContextMenu({ ...contextMenu, show: false });
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>Connect Wallet</button>
      <button onClick={handleSendData} disabled={!account}>
        Send Data
      </button>
      <button onClick={handleDeployContract} disabled={!account}>
        Deploy Contract
      </button>
      {`Connected Wallet: ${account} / Connected Chain: ${currentChain?.name}`}
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px', borderRadius: '5px', maxWidth: '600px', overflow: 'auto' }}>
        {sourceCode}
      </pre>
      {`Contract Address: ${contractAddress}`}
      <div>
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex" }}>
            <div className={classes.massiveInputAssetSelect}>
              <AssetSelect
                value={currentChain}
                assetOptions={getMergedChains()}
                onSelect={onChainSelect}
              />
            </div>
          </div>
        </div>
      </div>
        <BPbase/>
      <div style={{background: "lightblue"}}>
        <Daegin/>
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        ></svg>
      </div>
    </div>
  );
};

export default App;
