import React, { useEffect, useState } from "react";
import "viem/window";
import {
  createPublicClient,
  createWalletClient,
  custom,
  Chain,
  defineChain,
} from "viem";
import testJSON from "../../example.json";
import { getAllChains } from "./assets/chainList/allChains.ts";
import versionList from "./assets/solidity_Lists/solidity_version.json";
import licenseList from "./assets/solidity_Lists/solidity_license.json";
import BPbase from "./assets/Main/main.tsx";

import classes from "./assets/ssSwap.module.css";

import {
  Button,
  Dialog,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Construction, Search } from "@mui/icons-material";

import { License, fun, global, Store } from "./assets/type/types.ts";

//------------Store------------

const store: Store = {
  license: "",
  version: "",
  contractName: "",
  functions: [],
  globals: [],
};

//------------Local Storage Key------------

const CUSTOM_CHAINS_KEY = "customChains";
const CUSTOM_LICENSES_KEY = "customLicenses";

//------------Custom Chains------------

const saveCustomChains = (chains: Chain[]) => {
  localStorage.setItem(CUSTOM_CHAINS_KEY, JSON.stringify(chains));
};

const deleteCustomChain = (chainId: number | string) => {
  const customChains = loadCustomChains();
  const updatedChains = customChains.filter((chain) => chain.id !== chainId);
  saveCustomChains(updatedChains);
};

// Function to load custom chains from local storage
const loadCustomChains = (): Chain[] => {
  const storedChains = localStorage.getItem("customChains");
  return storedChains ? JSON.parse(storedChains) : [];
};

// Function to merge custom chains with default chains
const getMergedChains = (): Chain[] => {
  const customChains = loadCustomChains();
  const defaultChains = getAllChains();
  return [...customChains, ...defaultChains];
};

//------------Custom Licenses------------

const saveCustomLicenses = (license: License[]) => {
  localStorage.setItem(CUSTOM_LICENSES_KEY, JSON.stringify(license));
};

const deleteCustomLicenses = (license: number | string) => {
  const customChains = loadCustomLicenses();
  const updatedlicenses = customChains.filter(
    (asset) => asset.identifier !== license
  );
  saveCustomLicenses(updatedlicenses);
};

const loadCustomLicenses = (): License[] => {
  const storedLicenses = localStorage.getItem("customLicenses");
  return storedLicenses ? JSON.parse(storedLicenses) : [];
};

const getMergedLicenses = (): License[] => {
  const customChains = loadCustomLicenses();
  const defaultChains = licenseList.List;
  console.log("customChains", customChains);
  console.log("defaultChains", defaultChains);
  return [...customChains, ...defaultChains];
};

//------------Local Storage Key------------

async function connectWallet(): Promise<string | undefined> {
  if (!window.ethereum) {
    console.error("Metamask not found");
    return;
  }
  try {
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log("Connected account:", account);
    return account;
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}

async function getCurrentChain(): Promise<Chain | undefined> {
  if (!window.ethereum) {
    console.error("MetaMask not found");
    return;
  }
  try {
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16); // 16진수를 10진수로 변환
    let chain = getMergedChains().find((c) => c.id === chainId);
    //이거 없을때 추가하라고 하든 해야할 듯
    return chain;
  } catch (error) {
    console.error("Error getting current chain:", error);
  }
}

async function setWalletChain(chain: Chain) {
  const walletConnect = createWalletClient({
    chain: chain,
    transport: custom(window.ethereum!),
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

async function deployContract(
  //account: string,
  chain: Chain,
  abi: any,
  bytecode: any
) {
  const client = createPublicClient({
    chain: chain,
    transport: custom(window.ethereum!),
  });

  const walletConnect = createWalletClient({
    chain: chain,
    transport: custom(window.ethereum!),
  });

  try {
    const [accountData] = await walletConnect.getAddresses();
    const deployTx = await walletConnect.deployContract({
      abi,
      account: accountData,
      bytecode,
      args: [],
    });

    const receipt = await client.waitForTransactionReceipt({ hash: deployTx });
    console.log("Contract deployed at address:", receipt.contractAddress);
    return receipt.contractAddress;
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
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
    setAddCustomOpen(false);
    setDeleteCustomOpen(false);
  };

  const handleAddCustomChain = () => {
    const customChains = loadCustomChains();
    const chainExists = customChains.some(
      (chain) => chain.id === Number(chainId)
    );

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
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [rpcUrl],
          webSocket: undefined,
        },
      },
      blockExplorers: {
        default: {
          name: "Block Explorer",
          url: blockExplorerUrl,
        },
      },
      testnet: false,
    });

    console.log("newChain", newChain);

    //const customChains = loadCustomChains();
    //saveCustomChains([...customChains, newChain]);
    saveCustomChains([...customChains, newChain]);

    setNetworkName("");
    setChainId("");
    setRpcUrl("");
    setCurrencySymbol("");
    setBlockExplorerUrl("");
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
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <Typography
            variant="inherit"
            style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}
          >
            {asset.name}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ fontSize: "13px" }}
            color="textSecondary"
          >
            {asset.network}
          </Typography>
          <Typography
            variant="inherit"
            style={{ fontWeight: "500", fontSize: "13px" }}
          >
            {asset.id}
          </Typography>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            style={{ fontSize: "12px" }}
          >
            ChainID
          </Typography>
        </div>
        <Button
          onClick={() => handleDeleteCustomChain(asset.id)}
          color="secondary"
          variant="contained"
          style={{ marginLeft: 25 }}
        >
          Delete
        </Button>
      </MenuItem>
    );
  };

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
          <Typography
            variant="inherit"
            style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}
          >
            {asset.name}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ fontSize: "13px" }}
            color="textSecondary"
          >
            {asset.network}
          </Typography>
        </div>
        <div className={classes.assetSelectBalance}>
          <Typography
            variant="inherit"
            style={{ fontWeight: "500", fontSize: "13px" }}
          >
            {asset.id}
          </Typography>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            style={{ fontSize: "12px" }}
          >
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
              sx={{
                "& .MuiInputBase-root": { height: "35px" },
                input: { color: "#000000" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.addCustomChainButtons}>
            <Button
              onClick={addCustomChain}
              color="primary"
              variant="contained"
              style={{ marginTop: 1 }}
            >
              Add
            </Button>
            <Button
              onClick={delCustomChain}
              color="secondary"
              variant="contained"
              style={{ marginTop: 1, marginLeft: 10 }}
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
    const customChains = loadCustomChains();
    return (
      <>
        <div className={classes.addCustomChain}>
          <Typography variant="h6">
            Delete Custom Chain
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
              <Button
                onClick={handleAddCustomChain}
                color="primary"
                variant="contained"
                style={{ marginTop: 20 }}
              >
                Save
              </Button>
              <Button
                onClick={onCloseAddCustomChain}
                color="secondary"
                variant="contained"
                style={{ marginTop: 20, marginLeft: 10 }}
              >
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
          <Typography variant="body2" style={{ color: "red" }}>
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
        <Button
          onClick={handleAddCustomChain}
          color="primary"
          variant="contained"
          style={{ marginTop: 20 }}
        >
          Save
        </Button>
        <Button
          onClick={onCloseAddCustomChain}
          color="secondary"
          variant="contained"
          style={{ marginTop: 20, marginLeft: 10 }}
        >
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
            <div
              className={classes.assetTypo}
              style={{
                color: "black",
                boxShadow: "rgba 34, 34, 34, 0.02 0px 0px 1px 0px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              {value?.name}
              <div style={{ padding: "7px" }}>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        {renderOptions()}
      </Dialog>
      <Dialog
        onClose={onCloseAddCustomChain}
        aria-labelledby="simple-dialog-title"
        open={addCustomOpen}
      >
        {renderCustomChainForm()}
      </Dialog>
      <Dialog
        onClose={onCloseAddCustomChain}
        aria-labelledby="simple-dialog-title"
        open={delCustomOpen}
      >
        {renderDeleteCustomOptions()}
      </Dialog>
    </React.Fragment>
  );
}

function VersionSelect({ value, versionList, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredAssetOptions, setFilteredAssetOptions] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const openSearch = () => {
    setSearch("");
    setOpen(true);
  };

  useEffect(() => {
    async function sync() {
      console.log("onSelect", onselect);
      const ao = versionList.filter((asset: string) => {
        console.log("asset", asset);
        if (search && search !== "") {
          return asset.toLowerCase().includes(search.toLowerCase());
        } else {
          return true;
        }
      });
      setFilteredAssetOptions(ao);
    }
    sync();
  }, [versionList, search]);

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const setSelectedVersion = (asset: string) => {
    setSearch("");
    setOpen(false);
    onSelect(asset);
    store.version = asset;
  };

  const onClose = () => {
    setSearch("");
    setOpen(false);
    setError(null);
  };

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
        onClick={() => setSelectedVersion(asset)}
        style={{ margin: "1px 0" }}
      >
        <div>
          <Typography
            variant="inherit"
            style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}
          >
            {asset}
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
              sx={{
                "& .MuiInputBase-root": { height: "35px" },
                input: { color: "#000000" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
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

  return (
    <React.Fragment>
      <div className={classes.displaySelectContainer} onClick={openSearch}>
        <div className={classes.assetSelectMenuItem}>
          <div className={classes.displayDualIconContainer}>
            <div
              className={classes.assetTypo}
              style={{
                color: "black",
                boxShadow: "rgba 34, 34, 34, 0.02 0px 0px 1px 0px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              {value}
              <div style={{ padding: "7px" }}>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        {renderOptions()}
      </Dialog>
    </React.Fragment>
  );
}

function LicenseSelect({ value, LicenseList, onSelect }) {
  const [open, setOpen] = useState(false);
  const [addCustomOpen, setAddCustomOpen] = useState(false);
  const [delCustomOpen, setDeleteCustomOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [licenseName, setLicenseName] = useState<string>("");
  const [licenseIdentifier, setLicensIdentifier] = useState<string>("");
  const [filteredAssetOptions, setFilteredAssetOptions] = useState<License[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  console.log("LicenseList", LicenseList);

  const openSearch = () => {
    setSearch("");
    setOpen(true);
  };

  useEffect(() => {
    async function sync() {
      const ao = LicenseList.filter((license: License) => {
        console.log("license!", license);
        if (search && search !== "") {
          if (!isNaN(Number(search))) {
            return license.name.toString().includes(search);
          } else {
            return license.name.toLowerCase().includes(search.toLowerCase());
          }
        } else {
          return true;
        }
      });
      setFilteredAssetOptions(ao);
    }
    sync();
  }, [LicenseList, search]);

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const setSelectedLicense = (asset: License) => {
    setSearch("");
    setOpen(false);
    console.log("asset", asset);
    onSelect(asset);
    store.license = asset.identifier;
    console.log("store", store);
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

  const onCloseAddCustomLicenses = () => {
    setAddCustomOpen(false);
    setDeleteCustomOpen(false);
  };

  const handleAddCustomLicense = () => {
    const customLicenses = loadCustomLicenses();
    const LicenseExists = customLicenses.some(
      (asset) => asset.identifier == licenseIdentifier
    );

    if (LicenseExists) {
      setError("This chain ID already exists.");
      return;
    }

    console.log("ADD", licenseName, licenseIdentifier);

    const newLicense: License = {
      name: licenseName,
      identifier: licenseIdentifier,
    };

    console.log("newChain", newLicense);

    saveCustomLicenses([...customLicenses, newLicense]);

    setLicenseName("");
    setLicensIdentifier("");

    setAddCustomOpen(false);
    setFilteredAssetOptions([newLicense, ...LicenseList]);
  };

  const handleDeleteCustomLicense = (licenses: number | string) => {
    deleteCustomLicenses(licenses); //identifier로 체크함
    const updatedAssetOptions = getMergedLicenses();
    setFilteredAssetOptions(updatedAssetOptions);
    if (value.identifier === licenses) {
      onSelect(undefined); // 선택된 체인이 삭제된 경우 초기화
    }
  };

  const deleteLicense = (asset: License, idx: number) => {
    return (
      <MenuItem
        key={idx}
        className={classes.assetSelectMenu}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <Typography
            variant="inherit"
            style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}
          >
            {asset.name}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ fontSize: "13px" }}
            color="textSecondary"
          >
            {asset.identifier}
          </Typography>
        </div>
        <Button
          onClick={() => handleDeleteCustomLicense(asset.identifier)}
          color="secondary"
          variant="contained"
          style={{ marginLeft: 25 }}
        >
          Delete
        </Button>
      </MenuItem>
    );
  };

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
        onClick={() => setSelectedLicense(asset)}
        style={{ margin: "1px 0" }}
      >
        <div>
          <Typography
            variant="inherit"
            style={{ color: "#000000", fontWeight: "500", fontSize: "12px" }}
          >
            {asset.name}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ fontSize: "13px" }}
            color="textSecondary"
          >
            {asset.identifier}
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
              sx={{
                "& .MuiInputBase-root": { height: "35px" },
                input: { color: "#000000" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.addCustomChainButtons}>
            <Button
              onClick={addCustomChain}
              color="primary"
              variant="contained"
              style={{ marginTop: 1 }}
            >
              Add
            </Button>
            <Button
              onClick={delCustomChain}
              color="secondary"
              variant="contained"
              style={{ marginTop: 1, marginLeft: 10 }}
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
    const customLicenses = loadCustomLicenses();
    return (
      <>
        <div className={classes.addCustomChain}>
          <Typography variant="h6">
            Delete Custom License
            <div className={classes.searchContainer}>
              <div>
                {customLicenses && customLicenses.length > 0 ? (
                  customLicenses.map(deleteLicense)
                ) : (
                  <div>
                    <Typography>No results</Typography>
                  </div>
                )}
              </div>
              {/* 삭제 버튼 눌렀을 떄는 리스트에서만 없애고 save 눌렀을 떄 진짜 삭제 실행 */}
              <Button
                color="primary"
                variant="contained"
                style={{ marginTop: 20 }}
              >
                Save
              </Button>
              <Button
                onClick={onCloseAddCustomLicenses}
                color="secondary"
                variant="contained"
                style={{ marginTop: 20, marginLeft: 10 }}
              >
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
          <Typography variant="body2" style={{ color: "red" }}>
            {error}
          </Typography>
        )}
        <TextField
          label="License Name"
          value={licenseName}
          onChange={(e) => setLicenseName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="License Symbol"
          value={licenseIdentifier}
          onChange={(e) => setLicensIdentifier(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleAddCustomLicense}
          color="primary"
          variant="contained"
          style={{ marginTop: 20 }}
        >
          Save
        </Button>
        <Button
          onClick={onCloseAddCustomLicenses}
          color="secondary"
          variant="contained"
          style={{ marginTop: 20, marginLeft: 10 }}
        >
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
            <div
              className={classes.assetTypo}
              style={{
                color: "black",
                boxShadow: "rgba 34, 34, 34, 0.02 0px 0px 1px 0px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              {value}
              <div style={{ padding: "7px" }}>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        {renderOptions()}
      </Dialog>
      <Dialog
        onClose={onCloseAddCustomLicenses}
        aria-labelledby="simple-dialog-title"
        open={addCustomOpen}
      >
        {renderCustomChainForm()}
      </Dialog>
      <Dialog
        onClose={onCloseAddCustomLicenses}
        aria-labelledby="simple-dialog-title"
        open={delCustomOpen}
      >
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
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [currentLicense, setCurrentLicense] = useState<License>();
  const [forceRender, setForceRender] = useState<boolean>(false); // 강제 리렌더링 상태

  const fetchChain = async () => {
    const getWalletChain = await getCurrentChain();
    setCurrentChain(getWalletChain);
    setCurrentVersion(versionList.List[0]);
    setCurrentLicense(licenseList.List[0]);
  };

  const forceUpdate = () => setForceRender((prev) => !prev); // 강제 리렌더링 함수

  useEffect(() => {
    fetchChain();

    const handleChainChanged = async (chainId: string) => {
      console.log("체인 변경: ", chainId);
      await fetchChain();
      forceUpdate(); // 체인이 변경될 때 강제 리렌더링
    };

    const change = async () => {
      const result = await window.ethereum?.on(
        "chainChanged",
        handleChainChanged
      );
      await fetchChain();
      forceUpdate();
      console.log("결과: ", result);
    };

    if (window.ethereum) {
      console.log("메마 있음");
      change();
      console.log("chainChanged listener added");

      window.ethereum.on("connect", (info: { chainId: string }) => {
        console.log("Connected to network:", info.chainId);
      });

      window.ethereum.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          console.log("Disconnected from network:", error);
        }
      );
    } else {
      console.log("window.ethereum is not available");
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleSendData = async () => {
    try {
      const response = await fetch("http://localhost:3000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(store),
      });

      const result = await response.json();
      setSourceCode(result.source);
      setABI(result.abi);
      setByteCode(result.bytecode);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleConnectWallet = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  };

  const handleDeployContract = async () => {
    if (account && currentChain) {
      const ca = await deployContract(currentChain, abi, bytecode);
      setContractAddress(`${ca}`);
    }
  };

  const onChainSelect = async (chain: Chain) => {
    if (currentChain?.id === chain.id) {
      return;
    }
    const result = await setWalletChain(chain);
    if (result) {
      setCurrentChain(chain);
    }
  };

  const onVersionSelect = async (version: string) => {
    if (currentVersion === version) {
      console.log("same");
      return;
    }
    //const result = await setWalletChain(chain); -> 버전 정보 어디에 저장할지 정해야함
    const result = version;
    if (result) {
      console.log("버전 정보 어디에 저장할지 정해야함\n", version);
      setCurrentVersion(version);
    }
  };

  const onLicenseSelect = async (license: License) => {
    console.log("Onselect 후 ", license);
    if (currentLicense?.name == license.name) {
      console.log("same");
      return;
    }
    //const result = await setWalletChain(chain); -> 버전 정보 어디에 저장할지 정해야함
    const result = license;
    if (result) {
      console.log("라이센스 정보 어디에 저장할지 정해야함\n", license);
      setCurrentLicense(license);
    }
  };

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    show: boolean;
  }>({ x: 0, y: 0, show: false });

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      show: true,
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
      <div>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
        <button onClick={handleSendData} disabled={!account}>
          Send Data
        </button>
        <button onClick={handleDeployContract} disabled={!account}>
          Deploy Contract
        </button>
        {`Connected Wallet: ${account}`}
      </div>
      <div className={classes.inlineblock}>
        <AssetSelect
          value={currentChain}
          assetOptions={getMergedChains()}
          onSelect={onChainSelect}
        />
        <VersionSelect
          value={currentVersion}
          versionList={versionList.List}
          onSelect={onVersionSelect}
        />
        <LicenseSelect //라이센스 직접 추가도 가능하게.
          value={currentLicense?.name}
          LicenseList={getMergedLicenses()}
          onSelect={onLicenseSelect}
        />
      </div>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          maxWidth: "600px",
          overflow: "auto",
        }}
      >
        {sourceCode}
      </pre>
      <div>{`Contract Address: ${contractAddress}`}</div>
      <BPbase />
    </div>
  );
};

export default App;
