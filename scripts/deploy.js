const { ethers } = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners()

    const voting_factory = await ethers.getContractFactory("Voting")
    const contract = await voting_factory.deploy()
    console.log("Contract address:", contract.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
