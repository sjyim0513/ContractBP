import { Store } from "./type/types";

const createJson = async (store: Store) => {
  try {
    const response = await fetch("http://localhost:3000/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testJSON),
    });

    const result = await response.json();
    setSourceCode(result.source);
    setABI(result.abi);
    setByteCode(result.bytecode);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
