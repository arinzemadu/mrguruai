

let account;
const connectMetamask = async () => {

if (window.ethereum) {
  handleEthereum();
} else {
  window.addEventListener('ethereum#initialized', handleEthereum, {
    once: true,
  });

  // If the event is not dispatched by the end of the timeout,
  // the user probably doesn't have MetaMask installed.
  setTimeout(handleEthereum, 3000); // 3 seconds
}


}


connectMetamask();
async function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!');

        const accounts = await ethereum.request({
            method: "eth_requestAccounts"
        });
        account = accounts[0];


   if(window.ethereum.networkVersion == 137) {
        document.getElementById("accountArea").innerHTML = account;
        document.getElementById("send-button-txt").innerHTML = "ENTER WHITELIST";
        document.getElementsByClassName("wallet-connect")[0].innerHTML = "CONNECTED";
        document.getElementById("welcome").innerHTML = "WELCOME";
        document.getElementById("send-button-txt").disabled = false;

       await connectContract();
       await getPlayers();

}else{
  console.log('incorrect network');
  document.getElementsByClassName("wallet-connect")[0].innerHTML = "INCORRECT NETWORK SWITCH TO MATIC";
}
    // Access the decentralized web!
  } else {
    console.log('Already installed MetaMask!');
  }
}




const connectContract = async () => {
    const ABI = [
    {
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "moveFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPlayers",
        "outputs": [
            {
                "internalType": "address payable[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "players",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

    const Address = "0x95072EB497244b5a13f012D88be48E4e8b37AeE8";
    window.ethereum = await new Web3(window.ethereum);
    window.contract = await new window.ethereum.eth.Contract(ABI, Address);


}


const sendCrypto = async () => {
  // Check if the ethereum object is available
  if (window.ethereum) {
    // Request account access
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }

    // Calculate recommended gas limit based on current gas prices and complexity of the transaction
    const gasPrice = await window.ethereum.eth.getGasPrice();
    const estimatedGas = await window.contract.methods.enter().estimateGas();
    const recommendedGasLimit = gasPrice.mul(estimatedGas).mul(1.1); // Add 10% buffer

    // Get the current account
    const accounts = await window.ethereum.eth.getAccounts();
    const account = accounts[0];

    // Create the transaction parameters
    let transactionParam = {
      to: '0x95072EB497244b5a13f012D88be48E4e8b37AeE8',
      from: account,
      value: '1000000000000000000',
      gas: recommendedGasLimit
    };

    // Execute the transaction
    try {
      await window.contract.methods.enter().send(transactionParam);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Ethereum provider not found');
  }
}




const getPlayers = async () => {

    const data = await window.contract.methods.getPlayers().call();

    const data_choice = data.includes(account);

    if (data_choice == true) {
               document.getElementById("middlebuttons").innerHTML= '<h3>Your wallet has been white listed</h3>'; 
   
        console.log('you have already have a whitelist ticket');

    }else{
              console.log('you have not entered');
 }

    return data_choice;
}