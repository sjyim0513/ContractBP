import express from "express";
import { generateAndCompileContract } from "./compile";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/compile", async (req, res) => {
  const { license, version, contractName, globals, functions } = req.body;

  // console.log("전체\n", req.body)
  // console.log("전역변수\n", globals)
  // console.log("함수\n", functions)

  try {
    console.log("license", license);
    console.log("version", version);
    console.log("contractName", contractName);
    const compiledContract = await generateAndCompileContract(
      license,
      version,
      contractName,
      globals,
      functions
    );
    res.json({
      abi: compiledContract.abi,
      bytecode: compiledContract.bytecode,
      source: compiledContract.source,
    });
  } catch (error) {
    res.status(500).json({ error: "500이여" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
