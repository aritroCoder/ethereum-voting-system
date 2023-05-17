
![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# Ethereum Voting System

A decentralized voting platform, built over Ethereum, where candidates and voters can register to participate in voting process, which can be initiated by the contract owner.


## Features

- Allows contract owner to initiate and end a voting session.
- Prevents common issues like double voting, spam voters and candidates by requiring a nominal amount of ether for some operations.
- Voting results are hidden until contract owner ends voting session, which provide more transparency.
- Fully decentralized architecture tested and verified on Ethereum Sepolia Testnet.
- Elaborate testing infrastructure with unit and staging tests using [mocha](https://mochajs.org/).
- **94%** test code coverage according to [istanbul-js](https://istanbul.js.org/) reports

*This smart contract has **not** been audited and is provided as-is, we make no guarantees or warranties to its safety and reliability*


## Setup
Make sure you have `nodejs`, `yarn`, and `git` installed.

Clone the repo

```bash
git clone https://github.com/aritroCoder/ethereum-voting-system.git
cd ethereum-voting-system
```
Install required dependencies:
```bash
yarn
```


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`ALCHEMY_API_KEY`: Go to [alchemy](https://www.alchemy.com/) and create an API key.

`SEPOLIA_PRIVATE_KEY`: Use any ethereum wallet private key that is used to access Sepolia testnet.


## Run Locally

Compile the smart contract code
```bash
yarn hardhat compile
```

Run unit and staging tests

```bash
yarn hardhat test
```

Deploy to sepolia testnet (make sure you have some sepolia test ether). This command will output the address where it is deployed.
```bash
yarn hardhat run scripts/deploy.js --network sepolia
```
Get code coverage report
```bash
yarn hardhat coverage
```

Latest version of the contract is currently deployed at Sepolia address: `0x6f9f4957e157127eA607580B6231E7379C199f2c`


## Contributing

Contributions are always welcome!

Please adhere to the code formatting style while contributing. Prettier is configured in this project and will autoformat your code on command.
```bash
yarn format
```

For contributing, start be checking the issues section or create your own issue.

## Authors

- [@aritroCoder](https://www.github.com/aritroCoder)

