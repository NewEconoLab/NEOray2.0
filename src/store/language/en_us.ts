export default {
  button: {
    1: "Compile",
    2: "Request GAS",
    3: "In the queue",
    4: "Start debugging",
    5: "Stop debugging",
    6: "Add parameter",
    7: "Invoke",
    8: "Trial run",
    9: "Debug",
    10: "Download",
    11: process.env.REACT_APP_SERVER_ENV === "PUB" ? "Deployment contract on mainnet" : "Deploy contract",
    12: "Confirm",
    13: "Cancel",
    14: "Download TeemoNEO3"
  },
  code: {
    1: "Not deployed"
  },
  files: {
    1: "File browsing",
    2: "Add to local file",
    3: "Creat new contract file",
    4: "Load contract file that's been deployed",
    5: "Undeployed contracts",
    6: "Deployed contracts",
    7: "Loaded contracts",
    8: "Please enter file name",
    9: "Please enter contrac hash",
    10: "Please confirm to delete this file",
    11: "Rename",
    12: "Delete",
    13: "Creat new file",
    14: "Load deployed contract",
    15: "Delete file"
  },
  deploy: {
    1: "Contract deployment",
    2: "C#compiler",
    3: "Python compiler",
    4: "contract name",
    5: "Dynamic call",
    6: "Create storage area",
    7: "Accept payment",
    8: "GAS needed to deploy contract",
    9: "Wallet balance",
  },
  invoke: {
    1: "Contract call",
    2: "The current contract has not been deployed and cannot be called",
    3: "Please deploy contract first",
    4: "Call",
    5: "System fee",
    6: "Network fee",
    7: "Transaction attached GAS",
    8: "Call Main function",
    9: "Parameter",
    10: "None",
    11: "Array",
  },
  debug: {
    1: "Contract debugging",
    2: "The current contract has not been deployed and cannot be called",
    3: "Please deploy contract first",
    4: "Call",
    5: "System fee",
    6: "Network fee",
    7: "Transaction attached GAS",
    8: "Call Main function",
    9: "Parameter",
    10: "None",
    11: "Array",
    12: "No TX record for the contract",
  },
  about: {
    1: "Support",
    2: "Address",
    3: "GAS balance",
    4: "Each wallet can request 500 GAS once a day. Please leave a message on our forum if you need more GAS.",
    5: "Welcome to our community",
    6: "NEL Developer Forum",
    7: "Blockchain explorer",
    8: "NEORAY now supports NEO3 contract compilation and debugging.Connect to TeemoNEO3 to use the NEO3 compiler."
  },
  output: {
    1: "Output",
    2: "Transaction has been sent",
    3: "Transaction has been confirmed",
    4: "Call",
    5: "Compiled successfully",
    6: "Compile failed",
    7: "Deploy contract",
    8: "Trial run",
  },
  toast: {
    1: "Login successful",
    2: "You have declined the connection",
    3: "Connecting to Teemo",
    4: "Please confirm on the page",
    5: "Copied successfully",
    6: "Transaction sent successfully",
    7: "Transaction rejected",
    8: "Transaction failed",
    9: "Request sent successfully",
    10: "Insufficient gas collection failed, please leave a message in the forum.",
    11: "If the Teemo wallet is not detected, you will not be able to deploy and call the contract. Please use this function after installing the login wallet.",
    12: "Go to Teemo's official website",
    13: "Prompt",
    14: "Failed to get user info. Please log in to Teemo.",
  },
  network: {
    mainnet: "MainNet",
    testnet: "TestNet",
    neo3test: "NEO3 TestNet",
    prompt: "This function is not supported on mainnet"
  },
  url: {
    invoke: "http://medium.com/neweconolab/the-construction-method-of-parameters-that-call-contracts-f3964a2cbd9b",
    debug: "http://medium.com/neweconolab/the-help-instructions-of-contract-debugging-e1dfd75ccfd1",
  }
}