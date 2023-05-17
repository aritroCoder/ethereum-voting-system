const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Voting Contract-end to end staging test", function () {
    let contract
    let owner
    let addr1
    let addr2
    let candidateEntranceFee
    let voteFee
    beforeEach(async function () {
        let contract_factory = await ethers.getContractFactory("Voting")
        arr = await ethers.getSigners()
        owner = arr[0]
        addr1 = arr[1]
        addr2 = arr[2]
        contract = await contract_factory.deploy()
        candidateEntranceFee = await contract.getCandidateEntranceFee()
        voteFee = await contract.getVoteFee()
    })
    it("Allows  starting, voting, ending and declaring winner", async function () {
        await contract.startVote()
        await contract.addCandidate({ value: candidateEntranceFee })
        await contract.connect(addr1).addCandidate({ value: candidateEntranceFee })
        await contract.connect(addr2).addVoter()
        await contract.connect(addr2).vote(addr1.address, { value: voteFee })
        await contract.connect(addr1).vote(addr1.address, { value: voteFee })
        await contract.vote(owner.address, { value: voteFee })
        await contract.publishResults()
        expect(await contract.getWinner()).to.equal(addr1.address)
    })
})
